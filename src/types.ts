export type Contact = {
    id: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    email?: string;
    mobileNumber?: string;
    phoneNumber?: string;
    pager?: string;
    isFavorite: boolean;
}

export type ContactTypeValue = "email" | "mobileNumber" | "phoneNumber" | "pager"

export type ContactFormValues = {
    firstName: string;
    lastName: string;
    birthDate: string;
    email: string;
    mobileNumber: string;
    phoneNumber: string;
    pager: string;
}

export type contactType = {
    name: string;
    value: ContactTypeValue;
}