export enum UserRole {
    STUDENT = 'STUDENT',
    ADMIN = 'ADMIN'
}

export class User {
    public readonly createdAt: Date
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email: string,
        public readonly role: UserRole,
        public password: string,
        createdAt?: Date,
    ) {
        this.createdAt = createdAt ?? new Date()
    }
}