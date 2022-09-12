import { useEffect, useMemo, useRef } from 'react'
import {
    HStack, Link, Heading, Button, Box, useDisclosure, Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useMediaQuery
} from '@chakra-ui/react'
import { Link as ReactRouterLink, useLocation } from "react-router-dom"
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth"
import { useAppDispatch } from "../app/hooks"
import { selectUser, setActiveUser, setIsLoadingUser } from "../features/userSlice"
import { useAppSelector } from "../app/hooks"
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai"

const Nav = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef(null)
    const [display] = useMediaQuery("(min-width: 991px)")

    const { pathname } = useLocation();
    const auth = getAuth()
    const dispatch = useAppDispatch()
    const user = useAppSelector(selectUser)

    const linkProps = {
        color: { base: "white", lg: "black" },
        textDecoration: "none",
        p: 2,
        bg: { base: "blue.300", lg: "white" },
        borderRadius: "0.4em",
        fontWeight: 600,
        onClick: () => onClose(),
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

    const menuButtons = useMemo(() => (
        <>
            {pathname !== "/adresar/omiljeni" &&
                <Link {...linkProps} as={ReactRouterLink} to="/adresar/omiljeni" _hover={{ textDecoration: "none" }}>Omiljeni kontakti</Link>
            }
            {pathname !== "/adresar" &&
                <Link {...linkProps} as={ReactRouterLink} to="/adresar" _hover={{ textDecoration: "none" }}>Lista kontakata</Link>
            }
            {pathname !== "/kontakt" &&
                <Link {...linkProps} as={ReactRouterLink} to="/kontakt" _hover={{ textDecoration: "none" }}>Dodaj novi kontakt</Link>
            }
            <Button variant="outline" color={{ base: "black", lg: "white" }} _hover={{ color: "blue.300", backgroundColor: "white" }} onClick={() => {signOut(auth); onClose()}}>Odjavi se</Button>
        </>
    ), [pathname, linkProps, ReactRouterLink, signOut, auth])

    return (
        <HStack bg="blue.300" w="100%" h="4em" px="1em" justify="space-between" align="center">
            <Heading color="white">Adresar</Heading>
            {user.user &&
                <>
                    <Button ref={btnRef} onClick={onOpen} display={{ base: "flex", lg: "none" }} bg="transparent" px={0}><AiOutlineMenu color="white" fontSize="2em" /></Button>
                    <HStack display={{ base: "none", lg: "flex" }}>
                        {menuButtons}
                    </HStack>
                </>
            }
            {!display && <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <HStack align="center" bg="blue.300">
                        <DrawerCloseButton alignSelf="center" fontSize="1.5em" pt="0.5em" pr="0.5em" color="white" />
                        <DrawerHeader color="white">Adresar</DrawerHeader>
                    </HStack>
                    <DrawerBody display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={12}>
                        {menuButtons}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>}
        </HStack>
    )
}

export default Nav;
