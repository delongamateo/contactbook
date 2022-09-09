import { FC } from 'react'
import {
    Column,
    Table as ReactTable,
} from '@tanstack/react-table'
import { Input } from "@chakra-ui/react"

type FilterProps = {
    column: Column<any, any>;
    table: ReactTable<any>;
}

const Filter: FC<FilterProps> = ({ column }) => {
    const columnFilterValue = column.getFilterValue()

    return (
        <Input
            type="text"
            value={(columnFilterValue ?? '') as string}
            onChange={e => column.setFilterValue(e.target.value)}
        />
    )
}

export default Filter;
