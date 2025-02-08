interface ProtectedLayoutProps {
    children: React.ReactNode;
}

const ProtectedLayout = ({ children } : ProtectedLayoutProps) => {
    return (
        <div className="flex flex-col gap-y-10">
            {children}
        </div>
    );
}

export default ProtectedLayout;