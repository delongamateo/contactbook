import { FC, useState, useMemo, useEffect } from 'react'
import {
    Formik,
    FormikHelpers,
    FormikProps,
    Form,
    Field,
    FieldProps,
    FieldInputProps,
    useFormikContext,
} from 'formik';
import { Flex, FormLabel, FormControl, Input, FormErrorMessage, Button, useToast, Heading, VStack, HStack, Select } from '@chakra-ui/react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc } from "firebase/firestore"
import { db } from "../firebase"
import { useNavigate, useLocation, useParams } from "react-router-dom"
import { Contact, ContactTypeValue, ContactFormValues, contactType } from "../types"
import _ from "lodash"
import FormFields from "./FormFields"

const contactTypes: contactType[] = [
    {
        name: "Email",
        value: "email"
    },
    {
        name: "Mobitel",
        value: "mobileNumber"
    },
    {
        name: "Fiksni telefon",
        value: "phoneNumber"
    },
    {
        name: "Pager",
        value: "pager"
    }
]

const ContactForm = () => {
    const [subFormInputs, setSubFormInputs] = useState<contactType[]>(contactTypes)
    const [selectedSubFormInputs, setSelectedSubFormInputs] = useState<contactType[]>([])

    const toast = useToast();
    const { pathname } = useLocation();
    const { id } = useParams();

    const contactsRef = collection(db, "contacts")

    let initialValues: ContactFormValues = {
        firstName: "",
        lastName: "",
        birthDate: "",
        email: "",
        mobileNumber: "",
        phoneNumber: "",
        pager: "",
    }

    const showSuccessToast = (isNewContact: boolean) => {
        toast({
            title: isNewContact ? "Novi kontakt dodan" : "Kontakt je azuriran",
            status: "success",
            duration: 3000,
            isClosable: true,
        })
    }

    const showErrorToast = () => {
        toast({
            title: "Najmanje jedna vrsta kontakta treba biti dodana za spremanje kontakta",
            status: "error",
            duration: 3000,
            isClosable: true,
        })
    }

    const addInput = (selectedTypeValue?: ContactTypeValue) => {
        const selectedType = contactTypes.find((type) => type.value === selectedTypeValue) ?? contactTypes[0]
        setSelectedSubFormInputs((prev) => _.uniqBy([...prev, selectedType], "value"))
    }

    const removeInput = (selectedType: contactType) => {
        setSelectedSubFormInputs((prev) => [..._.pullAllBy(prev, [selectedType], "value")])
    }

    useEffect(() => setSubFormInputs([..._.difference(contactTypes, selectedSubFormInputs)]), [selectedSubFormInputs])

    return (
        <Flex justify="center">
            <VStack w="50%" bg="blue.100" borderRadius="12px" p={4}>
                <Heading>{pathname === "/kontakt" ? "Dodaj novi kontakt" : "Azuriraj kontakt"}</Heading>
                <Formik
                    initialValues={initialValues}
                    onSubmit={(values, actions) => {
                        const valuesArray = _.values(values)
                        let filled = 0;
                        for (let i = 0; i < valuesArray.length; i++) {
                            if (valuesArray[i] !== "") filled++
                        }
                        if (filled < 4) {
                            showErrorToast()
                            actions.setSubmitting(false);
                        } else {
                            if (id) {
                                updateDoc(doc(db, "contacts", id), values).then(() => { actions.setSubmitting(false); showSuccessToast(false) })
                            } else {
                                addDoc(contactsRef, values).then(() => { actions.setSubmitting(false); showSuccessToast(true); actions.resetForm(); })
                            }
                        }
                    }}
                >
                    {(props) => (
                        <FormFields
                            props={props}
                            id={id}
                            subFormInputs={subFormInputs}
                            removeInput={removeInput}
                            addInput={addInput}
                            selectedSubFormInputs={selectedSubFormInputs}
                            pathname={pathname}
                        />
                    )}
                </Formik>
            </VStack>
        </Flex>
    )
}

export default ContactForm;
