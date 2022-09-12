import { useState, useEffect } from "react"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Table, Thead, Tbody, Tr, Th, Td, chakra, Select, Button, Text, VStack, HStack, Flex, useMediaQuery } from "@chakra-ui/react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa"
import { AiOutlineStar, AiFillStar } from "react-icons/ai"
import {
    useReactTable,
    flexRender,
    getCoreRowModel,
    SortingState,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    Cell
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom"
import Filter from "./Filter"
import { useAppSelector } from "../app/hooks"
import { selectContacts } from "../features/contactsSlice";
import { updateDoc, doc } from "firebase/firestore"
import { db } from "../firebase"
import { Contact } from "../types";
import { selectUser } from "../features/userSlice";

const ContactList = () => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState({})
    const data = useAppSelector(selectContacts)
    const { user } = useAppSelector(selectUser);
    const [display] = useMediaQuery("(min-width: 991px)")
    const navigate = useNavigate()

    const changeIsFavorite = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, contact: Contact) => {
        e.stopPropagation();
        if (!user?.uid) return;
        const contactDoc = doc(db, user.uid, contact.id)
        updateDoc(contactDoc, { ...contact, isFavorite: !contact.isFavorite })
    }

    const onRowClick = (cell: Cell<Contact, unknown>) => {
        const data = cell.getContext().row.original
        navigate(`/kontakt/${data.id}`)
    }

    const columnHelper = createColumnHelper<Contact>();

    const columns: ColumnDef<Contact, any>[] = [
        columnHelper.accessor("firstName", {
            cell: (data) => data.getValue(),
            header: "First name"
        }),
        columnHelper.accessor("lastName", {
            cell: (data) => data.getValue(),
            header: "Last name",
        }),
        columnHelper.accessor("email", {
            cell: (data) => data.getValue(),
            header: "Email",


        }),
        columnHelper.accessor("isFavorite", {
            cell: (data) => (
                <Button bg="transparent" onClick={(e) => changeIsFavorite(e, data.row.original)}>
                    {data.getValue() ?
                        <AiFillStar size="1.3em" color="orange" />
                        :
                        <AiOutlineStar size="1.3em" color="black" />
                    }
                </Button>
            ),
            header: "",
        })
    ]

    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnVisibility
        },
        debugTable: true,
    });

    useEffect(() => {
        table.setPageSize(15)
    }, [data])

    useEffect(() => {
        table.getColumn("email").toggleVisibility(display)
    }, [display])

    return (
        <>
            <Table>
                <Thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                const meta: any = header.column.columnDef.meta;
                                return (
                                    <Th
                                        key={header.id}
                                        isNumeric={meta?.isNumeric}
                                    >
                                        <VStack>
                                            <Flex
                                                w="100%" justify="flex-start" align="center"
                                                onClick={header.id === "lastName" ? header.column.getToggleSortingHandler() : undefined}
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {header.id === "lastName" &&
                                                    <chakra.span pl="4">
                                                        {header.column.getIsSorted() ? (
                                                            header.column.getIsSorted() === "desc" ? (
                                                                <FaArrowDown aria-label="sorted descending" />
                                                            ) : (
                                                                <FaArrowUp aria-label="sorted ascending" />
                                                            )
                                                        ) : null}
                                                    </chakra.span>
                                                }
                                            </Flex>
                                            {header.id !== "isFavorite" && <Filter column={header.column} table={table} />}
                                        </VStack>
                                    </Th>
                                );
                            })}
                        </Tr>
                    ))}
                </Thead>
                <Tbody>
                    {table.getRowModel().rows.map((row) => (
                        <Tr key={row.id} _hover={{ cursor: "pointer", backgroundColor: "blue.100" }}>
                            {row.getVisibleCells().map((cell) => {
                                const meta: any = cell.column.columnDef.meta;
                                return (
                                    <Td key={cell.id} isNumeric={meta?.isNumeric} onClick={() => onRowClick(cell)}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </Td>
                                );
                            })}
                        </Tr>
                    ))}
                </Tbody>
            </Table>
            <HStack w="100%" p="1em">
                <Select
                    w="5em"
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value))
                    }}
                >
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="45">45</option>
                </Select>
                <HStack alignSelf="center">
                    <Button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<'}
                    </Button>
                    <Text>
                        {`${table.getState().pagination.pageIndex + 1} of ${table.getPageCount()}`}
                    </Text>
                    <Button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        {'>'}
                    </Button>
                </HStack>


            </HStack>

        </>
    );
}

export default ContactList;

