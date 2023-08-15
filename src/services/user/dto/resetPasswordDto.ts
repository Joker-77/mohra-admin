export interface ResetPasswordDto {
    userId: number;
    newPassword: string;
}

export interface ResetPasswordForCurrentDto {
    adminPassword: string;
    userId: number;
    newPassword: string;
}