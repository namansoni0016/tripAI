import { CardWrapper } from "@/components/auth/card-wrapper";

export const RegisterForm = () => {
    return (
        <CardWrapper headerTitle="Create an account" headerLabel="Welcome to TripAI, Adventure Awaits!"
            backButtonLabel="Don't have an account?" backButtonHref="/auth/login" showSocial
        >Register Form</CardWrapper>
    )
}