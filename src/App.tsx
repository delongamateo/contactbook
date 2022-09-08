import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks"
import { setContacts } from "./features/contactsSlice";
import {
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import ContactList from "./components/ContactList";
import CreateContact from "./components/CreateContact"
import Login from "./components/Login"
import Nav from "./components/Nav"
import { db } from "./firebase"
import { collection, getDocs, onSnapshot, orderBy, query, endAt, where } from "firebase/firestore"
import { VStack } from "@chakra-ui/react";
import Protected from "./components/Protected"

const App = () => {
  const contactsRef = collection(db, "contacts")
  const favoritesQuery = query(contactsRef, where("isFavorite", "==", true))
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  useEffect(() => {
    const fetchData = onSnapshot(pathname === "/adresar/omiljeni" ? favoritesQuery : contactsRef, snapshot => {
      dispatch(setContacts(snapshot.docs.map((contact) => ({ ...contact.data(), id: contact.id }))))
    })

    return () => {
      fetchData()
    }
  }, [pathname])

  return (
    <VStack bg="gray.50" h="100vh" align="stretch">
      <Nav />
      <Routes>
        <Route path="/" element={<Protected children={null} />} />
        <Route path="/signIn" element={<Login />} />
        <Route path="/signUp" element={<Login />} />
        <Route path="/adresar">
          <Route index element={<Protected><ContactList /></Protected>} />
          <Route path="omiljeni" element={<Protected><ContactList /></Protected>} />
        </Route>
        <Route path="/kontakt">
          <Route index element={<Protected><CreateContact /></Protected>} />
          <Route path=":id" element={<Protected><CreateContact /></Protected>} />
        </Route>
      </Routes>
    </VStack>
  )
}

export default App;
