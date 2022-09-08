import { FC, useEffect } from "react"
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks"
import { selectUser } from "../features/userSlice"
import { Spinner, Flex } from "@chakra-ui/react"

type ProtectedProps = {
    children: JSX.Element | null;
}

const Protected: FC<ProtectedProps> = ({ children }) => {
    const user = useAppSelector(selectUser)
    useEffect(() => console.log(user), [user])
    if (user.user === "loading") {
        return (
            <Flex h="100%" align="center" justify="center">
                <Spinner
                    thickness='6px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xl'
                />
            </Flex>
        )
    } else if (!user.user) {
        return <Navigate to="/signIn" replace />;
    } else if (!children) {
        return <Navigate to="/adresar" replace />;
    } else {
        return children;
    }
};

export default Protected;