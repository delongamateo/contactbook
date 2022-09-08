import { FC, useEffect, useState } from "react";
import {
    Formik,
    FormikHelpers,
    FormikProps,
    Form,
    Field,
    FieldProps,
    FieldInputProps,
} from "formik";
import {
    FormLabel,
    FormControl,
    Input,
    FormErrorMessage,
    Button,
    VStack,
    Text,
    HStack,
    Heading,
    Flex,
    Link
} from "@chakra-ui/react";
import {
    getAuth,
    createUserWithEmailAndPassword,
    setPersistence,
    signInWithEmailAndPassword,
    browserSessionPersistence,

} from "firebase/auth";
import { useAppDispatch } from "../app/hooks";
import { setActiveUser, selectUser } from "../features/userSlice";
import { useAppSelector } from "../app/hooks";
import { useNavigate, useParams, useLocation, Link as ReactRouterLink, } from "react-router-dom";

type LoginFormValues = {
    email: string;
    password: string;
};

const Login = () => {
    const [signUp, setIsSignUp] = useState<boolean>(true);
    const initialValues: LoginFormValues = {
        email: "",
        password: "",
    };

    const auth = getAuth();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const validateEmail = (value: string) => {
        const emailReg = /\S+@\S+\.\S+/;
        let error;
        if (!emailReg.test(value)) {
            error = "Enter valid email!";
        }
        return error;
    };

    const validatePassword = (value: string) => {
        let error;
        if (value.length < 6) {
            error = "Password is too short!";
        } else if (value.search(/\d/) === -1) {
            error = "Password must contain one number!";
        } else if (value.search(/[a-zA-Z]/) === -1) {
            error = "Password must contain at least one letter";
        } else if (value.search(/[+!#$-]/) === -1) {
            error = "Password must contain at least one of +,!,#,$,-";
        }
        return error;
    };

    return (
        <Flex justify="center">
            <VStack w="30%" bg="blue.100" borderRadius="12px" p={4} spacing={4}>
                <Heading>{pathname === "/signIn" ? "Prijavi se" : "Izradi racun"}</Heading>
                <Formik
                    initialValues={initialValues}
                    onSubmit={(values, actions) => {
                        if (!values.email || !values.password) return;
                        if (pathname === "/signUp") {
                            setPersistence(auth, browserSessionPersistence).then(() => {
                                createUserWithEmailAndPassword(
                                    auth,
                                    values.email,
                                    values.password
                                )
                                    .then((user) => {
                                        const { displayName, email, photoURL } = user.user;
                                        dispatch(setActiveUser({ displayName, email, photoURL }));
                                    })
                                    .then(() => {
                                        navigate("/");
                                        actions.setSubmitting(false);
                                    })
                                    .catch(() => {
                                        actions.setFieldError("password", "Neispravan email ili lozinka")
                                        actions.setSubmitting(false);
                                    })
                            });
                        } else {
                            setPersistence(auth, browserSessionPersistence).then(() => {
                                signInWithEmailAndPassword(auth, values.email, values.password)
                                    .then((user) => {
                                        const { displayName, email, photoURL } = user.user;
                                        dispatch(setActiveUser({ displayName, email, photoURL }));
                                    })
                                    .then(() => {
                                        navigate("/");
                                        actions.setSubmitting(false);
                                    })
                                    .catch(() => {
                                        actions.setFieldError("password", "Neispravan email ili lozinka")
                                        actions.setSubmitting(false);
                                    })
                            });
                        }
                    }}
                >
                    {(props) => (
                        <Form>
                            <Field name="email" validate={validateEmail}>
                                {({
                                    field,
                                    form,
                                }: {
                                    field: FieldInputProps<string>;
                                    form: FormikProps<LoginFormValues>;
                                }) => (
                                    <FormControl
                                        isInvalid={!!form.errors.email && form.touched.email}
                                    >
                                        <FormLabel>Email</FormLabel>
                                        <Input {...field} variant="filled" />
                                        <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                            <Field name="password" validate={validatePassword}>
                                {({
                                    field,
                                    form,
                                }: {
                                    field: FieldInputProps<string>;
                                    form: FormikProps<LoginFormValues>;
                                }) => (
                                    <FormControl
                                        isInvalid={!!form.errors.password && form.touched.password}
                                    >
                                        <FormLabel>Lozinka</FormLabel>
                                        <Input {...field} variant="filled" type="password" />
                                        <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                            <Button
                                mt={4}
                                colorScheme="teal"
                                isLoading={props.isSubmitting}
                                type="submit"
                            >
                                {pathname === "/signUp" ? "Izradi racun" : "Prijavi se"}
                            </Button>
                        </Form>
                    )}
                </Formik>
                <HStack>
                    <Text>{pathname === "/signIn" ? "Nemate racun?" : "Vec imate racun?"}</Text>
                    <Link as={ReactRouterLink} to={pathname === "/signUp" ? "/signIn" : "/signUp"}>
                        {pathname === "/signIn" ? "Izradi racun" : "Prijavi se"}
                    </Link>
                </HStack>
            </VStack>
        </Flex>
    );
};

export default Login;
