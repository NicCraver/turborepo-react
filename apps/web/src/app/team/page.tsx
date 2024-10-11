'use client'

import React, { useState, useEffect } from "react";

import Pagination from '../../components/Pagination'
import UsersTable from '../../components/UsersTable';
import Button from '../../components/Button';
import { useUserManagement } from './useUserManagement'

const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'createdAt', header: 'CreatedAt' },
    { key: 'updatedAt', header: 'UpdatedAt' },
];



export default function Team(): JSX.Element {


    const {
        name,
        setName,
        email,
        setEmail,
        message,
        users,
        paginationData,
        handleRandomGeneration,
        handleCreate,
        handleRead,
        handleUpdate,
        handleDelete,
        handleQueryUsers
    } = useUserManagement();

    useEffect(() => {
        handleQueryUsers(1, 10);
    }, []);


    const actions = [
        {
            label: 'Edit',
            onClick: async (data: any) => {
                console.log('Edit', data);
                handleUpdate(data)
            },
        },
        {
            label: 'Delete',
            onClick: (data: any) => {
                console.log('Delete', data);
                handleDelete(data.id)
            },
        },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const totalItems = paginationData.totalItems;
    const itemsPerPage = paginationData.pageSize;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        handleQueryUsers(page, itemsPerPage)
    };
    return (
        <>
            <div className="flex px-4 sm:px-6 lg:px-8 mb-4 space-x-4">
                <div>
                    姓名： {name}
                </div>
                <div>
                    邮箱： {email}
                </div>
                {paginationData.totalPages}

            </div>
            <UsersTable
                tableName='用户'
                describe='所有用户的列表，包括其详细信息。'
                columns={columns}
                tableData={users}
                actions={actions} >
                <div className="space-x-2">
                    <Button onClick={handleRandomGeneration}>随机生成数据</Button>

                    <Button onClick={handleCreate}>创建用户</Button>
                </div>
            </UsersTable>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
            />
        </>
    )
}