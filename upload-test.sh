#!/bin/bash

# Script para probar la carga de archivos a S3 usando presigned URL

# Función para detectar el lenguaje según la extensión
get_language() {
    local file="$1"
    local ext="${file##*.}"
    
    case "$ext" in
        cpp|cc|cxx|c++)
            echo "cpp"
            ;;
        py)
            echo "python"
            ;;
        js)
            echo "javascript"
            ;;
        java)
            echo "java"
            ;;
        go)
            echo "go"
            ;;
        *)
            echo "cpp"  # default
            ;;
    esac
}

echo "=== S3 Upload Test Script ==="
echo ""

# 1. Configuración
API_URL="http://localhost:3000"
JWT_TOKEN="${1:-}"  # Primer argumento es el token
FILE_TO_UPLOAD="${2:-test.cpp}"  # Segundo argumento es el archivo

if [ -z "$JWT_TOKEN" ]; then
    echo "❌ Error: JWT_TOKEN no proporcionado"
    echo "Uso: ./upload-test.sh <JWT_TOKEN> [FILE_PATH]"
    echo ""
    echo "Ejemplo:"
    echo "  ./upload-test.sh eyJhbGciOiJIUzI1NiIs... test.cpp"
    exit 1
fi

# 2. Crear archivo de prueba si no existe
if [ ! -f "$FILE_TO_UPLOAD" ]; then
    echo "📝 Creando archivo de prueba: $FILE_TO_UPLOAD"
    cat > "$FILE_TO_UPLOAD" << 'EOF'
#include <iostream>
using namespace std;

int main() {
    cout << "Hello World!" << endl;
    return 0;
}
EOF
fi

echo "📦 Archivo a subir: $FILE_TO_UPLOAD"
echo ""

# 3. Obtener presigned URL
echo "🔐 Obteniendo presigned URL..."
RESPONSE=$(curl -s -X POST "$API_URL/submissions/presignedurl" \
  -H 'Authorization: Bearer '"$JWT_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "fileName": "'$(basename $FILE_TO_UPLOAD)'",
    "fileType": "text/plain"
  }')

echo "Respuesta API: $RESPONSE"
echo ""

# 4. Extraer URL - intentar desde JSON o directamente
PRESIGNED_URL=$(echo "$RESPONSE" | grep -o '"url":"[^"]*' | cut -d'"' -f4)

# Si no encontró en formato JSON, la URL podría estar directamente
if [ -z "$PRESIGNED_URL" ]; then
    # Intentar extraer URL que empieza con https://
    PRESIGNED_URL=$(echo "$RESPONSE" | grep -o 'https://[^"]*' | head -n 1)
fi

if [ -z "$PRESIGNED_URL" ]; then
    echo "❌ Error: No se obtuvo la presigned URL"
    exit 1
fi

echo "✅ URL Presignada obtenida:"
echo "$PRESIGNED_URL"
echo ""

# 5. Subir archivo a S3
echo "📤 Subiendo archivo a S3..."
UPLOAD_RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT "$PRESIGNED_URL" \
  -H 'Content-Type: text/plain' \
  --data-binary "@$FILE_TO_UPLOAD")

HTTP_CODE=$(echo "$UPLOAD_RESPONSE" | tail -n 1)
BODY=$(echo "$UPLOAD_RESPONSE" | head -n -1)

echo "HTTP Code: $HTTP_CODE"
echo "Response Body: $BODY"
echo ""

if [ "$HTTP_CODE" -eq 200 ]; then
    echo "✅ ¡Archivo subido exitosamente!"
    echo ""
    
    # 6. Enviar submission al backend con el codeUrl
    echo "� Creando submission en el backend..."
    
    # Extraer userId del JWT (segunda parte del token decodificado)
    IFS='.' read -r HEADER PAYLOAD SIGNATURE <<< "$JWT_TOKEN"
    
    # Decodificar el payload (agregar padding si es necesario)
    PADDING=$((${#PAYLOAD} % 4))
    if [ $PADDING -ne 0 ]; then
        PADDING=$((4 - PADDING))
        PAYLOAD="$PAYLOAD$(printf '%*s' $PADDING | tr ' ' '=')"
    fi
    
    # Decodificar base64
    DECODED=$(echo "$PAYLOAD" | base64 -d 2>/dev/null)
    USER_ID=$(echo "$DECODED" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
    
    echo "User ID extraído: $USER_ID"
    
    # Construir el S3 Key basado en la estructura de presigned URL
    TIMESTAMP=$(date +%s)
    S3_KEY="submissions/$USER_ID/$TIMESTAMP-$(basename $FILE_TO_UPLOAD)"
    
    # URL completa para referencia (aunque se almacena solo la key)
    S3_URL="https://codes-backend.s3.us-east-2.amazonaws.com/$S3_KEY"
    
    echo "S3 Key: $S3_KEY"
    echo "S3 URL: $S3_URL"
    echo ""
    
    # Crear submission
    SUBMISSION_RESPONSE=$(curl -s -X POST "$API_URL/submissions" \
      -H 'Content-Type: application/json' \
      -d '{
        "userId": "'$USER_ID'",
        "challengeId": "challenge-1",
        "language": "'$(get_language "$FILE_TO_UPLOAD")'",
        "codeUrl": "'$S3_KEY'"
      }')
    
    echo "Respuesta Submission: $SUBMISSION_RESPONSE"
    echo ""
    echo "✅ ¡Proceso completado!"
else
    echo "❌ Error al subir archivo (HTTP $HTTP_CODE)"
    exit 1
fi
