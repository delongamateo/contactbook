import { useEffect } from 'react'
import { HStack, Link, Heading, Button } from '@chakra-ui/react'
import { Link as ReactRouterLink, useLocation } from "react-router-dom"
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth"
import { useAppDispatch } from "../app/hooks"
import { selectUser, setActiveUser, setIsLoadingUser } from "../features/userSlice"
import { useAppSelector } from "../app/hooks"

const Nav = () => {

    const { pathname } = useLocation();
    const auth = getAuth()
    const dispatch = useAppDispatch()
    const user = useAppSelector(selectUser)

    const linkProps = {
        textDecoration: "none",
        p: 2,
        bg: "white",
        borderRadius: "0.4em",
        fontWeight: 600,
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const { displayName, email, photoURL, uid } = user
                dispatch(setActiveUser({ displayName, email, photoURL, uid }))
                dispatch(setIsLoadingUser(false))

            } else {
                dispatch(setActiveUser(null))
                dispatch(setIsLoadingUser(false))
            }
        })
    }, [auth.currentUser])

    return (
        <HStack bg="blue.300" w="100%" h="4em" px="1em" justify="space-between" align="center">
            <Heading color="white">Adresar</Heading>
            {user.user && <HStack>
                {pathname !== "/adresar/omiljeni" &&
                    <Link {...linkProps} as={ReactRouterLink} to="/adresar/omiljeni" _hover={{ textDecoration: "none" }}>Omiljeni kontakti</Link>
                }
                {pathname !== "/adresar" &&
                    <Link {...linkProps} as={ReactRouterLink} to="/adresar" _hover={{ textDecoration: "none" }}>Lista kontakata</Link>
                }
                {pathname !== "/kontakt" &&
                    <Link {...linkProps} as={ReactRouterLink} to="/kontakt" _hover={{ textDecoration: "none" }}>Dodaj novi kontakt</Link>
                }
                <Button variant="outline" color="white" _hover={{ color: "blue.300", backgroundColor: "white" }} onClick={() => signOut(auth)}>Odjavi se</Button>
            </HStack>}
        </HStack>
    )
}

export default Nav;
