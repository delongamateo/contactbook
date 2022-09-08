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
import { FormLabel, FormControl, Input, FormErrorMessage, Button, useToast, Heading, VStack, HStack, Select } from '@chakra-ui/react';
import { Contact, ContactTypeValue, ContactFormValues, contactType } from "../types"
import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, DocumentReference, DocumentData } from "firebase/firestore"
import { useNavigate, useLocation, useParams } from "react-router-dom"
import { db } from "../firebase"

type FormFieldsProps = {
    props: FormikProps<ContactFormValues>;
    id?: string;
    subFormInputs: contactType[];
    removeInput: (selectedType: contactType) => void;
    addInput: (selectedTypeValue?: ContactTypeValue) => void;
    selectedSubFormInputs: contactType[];
    pathname: string;
}

const FormFields: FC<FormFieldsProps> = ({ props, id, subFormInputs, removeInput, addInput, selectedSubFormInputs, pathname }) => {
    const [selectedType, setSelectedType] = useState<ContactTypeValue>()
    const navigate = useNavigate()

    const validateFirstName = (value: string) => {
        let error;
        if (value.length > 100) {
            error = "Ime moze sadrzavati najvise 100 znakova!"
        }
        return error;
    }

    const validateLastName = (value: string) => {
        let error;
        if (value.length > 300) {
            error = "Prezime moze sadrzavati najvise 300 znakova!"
        }
        return error;
    }

    const validateContact = (value: string, type: string) => {
        const emailReg = /\S+@\S+\.\S+/;
        const phoneNumberReg = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
        let error;
        if (type === "email") {
            if (!emailReg.test(value)) {
                error = "Unesite pravilan email!"
            }
            return error;
        } else if (type === "mobileNumber") {
            if (!phoneNumberReg.test(value)) {
                error = "Unesite pravilan broj mobitela!"
            }
            return error;
        } else if (type === "phoneNumber") {
            if (!phoneNumberReg.test(value)) {
                error = "Unesite pravilan broj telefona!"
            }
            return error;
        } else if (type === "pager") {
            if (!phoneNumberReg.test(value)) {
                error = "Unesite pravilan broj pagera!"
            }
            return error;
        }
    }

    const deleteContact = () => {
        if (!id) return;
        deleteDoc(doc(db, "contacts", id)).then(() => navigate("/adresar"))
    }

    const selectType = useMemo(() => (
        <>
            {subFormInputs.length > 0 && <VStack gap={0}>
                <FormLabel alignSelf="start" mb={0}>Dodaj vrstu kontakta:</FormLabel>
                <HStack w="100%">
                    <Select placeholder='Select option' value={selectedType ?? ""} onChange={(e) => setSelectedType(e.target.value as ContactTypeValue)} variant="filled">
                        {subFormInputs.map((type, i) => (
                            <option value={type.value} key={i}>{type.name}</option>
                        ))}
                    </Select>
                    <Button disabled={!selectedType} onClick={() => { addInput(selectedType); setSelectedType(undefined) }}>Dodaj</Button>
                </HStack>
            </VStack>}
        </>
    ), [subFormInputs, selectedType])

    useEffect(() => {
        if (!id) return;
        getDoc(doc(db, "contacts", id))
            .then((response) => {
                const data = response.data()
                if (!data) return;
                props.setValues({
                    firstName: data?.firstName ?? "",
                    lastName: data?.lastName ?? "",
                    birthDate: data?.birthDate ?? "",
                    email: data?.email ?? "",
                    mobileNumber: data?.mobileNumber ?? "",
                    phoneNumber: data?.phoneNumber ?? "",
                    pager: data?.pager ?? "",
                })
                for (const [key, value] of Object.entries(data)) {
                    if (
                        value !== "" && (
                            key === "email" ||
                            key === "mobileNumber" ||
                            key === "phoneNumber" ||
                            key === "pager"
                        )) {
                        addInput(key as ContactTypeValue)
                        console.log(value)
                    }
                }
            })
    }, [id])

    useEffect(() => {
        if (id) return;
        props.handleReset()
    }, [id])

    return (
        <Form style={{ width: "100%" }}>
            <Field name="firstName" validate={validateFirstName}>
                {({ field, form }: { field: FieldInputProps<string>, form: FormikProps<ContactFormValues> }) => (
                    <FormControl isInvalid={!!form.errors.firstName && form.touched.firstName}>
                        <FormLabel>Ime</FormLabel>
                        <Input {...field} required variant="filled" />
                        <FormErrorMessage>{form.errors.firstName}</FormErrorMessage>
                    </FormControl>
                )}
            </Field>
            <Field name="lastName" validate={validateLastName}>
                {({ field, form }: { field: FieldInputProps<string>, form: FormikProps<ContactFormValues> }) => (
                    <FormControl isInvalid={!!form.errors.lastName && form.touched.lastName}>
                        <FormLabel>Prezime</FormLabel>
                        <Input {...field} required variant="filled" />
                        <FormErrorMessage>{form.errors.lastName}</FormErrorMessage>
                    </FormControl>
                )}
            </Field>
            <Field name="birthDate">
                {({ field, form }: { field: FieldInputProps<string>, form: FormikProps<ContactFormValues> }) => (
                    <FormControl isInvalid={!!form.errors.birthDate && form.touched.birthDate}>
                        <FormLabel>Datum rodenja</FormLabel>
                        <Input {...field} type="date" required variant="filled" />
                        <FormErrorMessage>{form.errors.birthDate}</FormErrorMessage>
                    </FormControl>
                )}
            </Field>
            {selectedSubFormInputs.map((type, i) => (
                <HStack key={i}>
                    <Field name={type.value} validate={(value: string) => validateContact(value, type.value)} key={i}>
                        {({ field, form }: { field: FieldInputProps<string>, form: FormikProps<ContactFormValues> }) => (
                            <FormControl isInvalid={!!form.errors[type.value] && form.touched[type.value]}>
                                <FormLabel>{type.name}</FormLabel>
                                <HStack>
                                    <Input {...field} required variant="filled" />
                                    <Button colorScheme='red' onClick={() => { removeInput(type); props.setFieldValue(type.value, "") }}>X</Button>
                                </HStack>
                                <FormErrorMessage>{form.errors[type.value]}</FormErrorMessage>
                            </FormControl>
                        )}
                    </Field>
                </HStack>
            ))}
            {selectType}
            <HStack mt={4}>
                <Button
                    colorScheme='teal'
                    isLoading={props.isSubmitting}
                    type='submit'
                >
                    {pathname === "/kontakt" ? "Dodaj" : "Azuriraj"}
                </Button>
                {id && <Button
                    colorScheme='red'
                    onClick={deleteContact}
                >
                    Izbrisi
                </Button>}
            </HStack>

        </Form>
    )
}

export default FormFields;
