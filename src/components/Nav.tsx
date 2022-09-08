import React, { useEffect, useMemo } from 'react'
import { HStack, Link, Heading, Button } from '@chakra-ui/react'
import { Link as ReactRouterLink, useLocation } from "react-router-dom"
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth"
import { useAppDispatch } from "../app/hooks"
import { selectUser, setActiveUser } from "../features/userSlice"
import { useAppSelector } from "../app/hooks"

const Nav = () => {

    const { pathname } = useLocation();
    const auth = getAuth()
    const dispatch = useAppDispatch()
    const user = useAppSelector(selectUser)

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const { displayName, email, photoURL } = user
                dispatch(setActiveUser({ displayName, email, photoURL }))

            } else {
                dispatch(setActiveUser(null))
            }
        })
    }, [auth.currentUser])

    return (
        <HStack bg="blue.300" w="100%" h="4em" px="1em" justify="space-between" align="center">
            <Heading color="white">Adresar</Heading>
            {user.user && <HStack>
                {pathname !== "/adresar/omiljeni" &&
                    <Link textDecoration="none" p={2} bg="white" borderRadius="0.5em" fontWeight={600} as={ReactRouterLink} to="/adresar/omiljeni" _hover={{ textDecoration: "none" }}>Omiljeni kontakti</Link>
                }
                {pathname !== "/adresar" &&
                    <Link p={2} bg="white" borderRadius="0.5em" fontWeight={600} as={ReactRouterLink} to="/adresar" _hover={{ textDecoration: "none" }}>Lista kontakata</Link>
                }
                {pathname !== "/kontakt" &&
                    <Link textDecoration="none" p={2} bg="white" borderRadius="0.5em" fontWeight={600} as={ReactRouterLink} to="/kontakt" _hover={{ textDecoration: "none" }}>Dodaj novi kontakt</Link>
                }
                <Button variant="outline" color="white" _hover={{ color: "blue.300", backgroundColor: "white" }} onClick={() => signOut(auth)}>Log out</Button>
            </HStack>}
        </HStack>
    )
}

export default Nav;
