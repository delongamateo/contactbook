import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks"
import { setContacts } from "./features/contactsSlice";
import {
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import ContactList from "./components/ContactList";
import ContactForm from "./components/ContactForm"
import Login from "./components/Login"
import Nav from "./components/Nav"
import { db } from "./firebase"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { VStack } from "@chakra-ui/react";
import Protected from "./components/Protected"
import { useAppSelector } from "./app/hooks";
import { selectUser } from "./features/userSlice";

const App = () => {
  const { user } = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!user?.uid) return;
    const contactsRef = collection(db, user.uid)
    const favoritesQuery = query(contactsRef, where("isFavorite", "==", true))

    const fetchData = onSnapshot(pathname === "/adresar/omiljeni" ? favoritesQuery : contactsRef, snapshot => {
      dispatch(setContacts(snapshot.docs.map((contact) => ({ ...contact.data(), id: contact.id }))))
    })

    return () => {
      fetchData()
    }
  }, [pathname, user])

  return (
    <VStack bg="gray.50" minH="100vh" align="stretch">
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
          <Route index element={<Protected><ContactForm /></Protected>} />
          <Route path=":id" element={<Protected><ContactForm /></Protected>} />
        </Route>
      </Routes>
    </VStack>
  )
}

export default App;
