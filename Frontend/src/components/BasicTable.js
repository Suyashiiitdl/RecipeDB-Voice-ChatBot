import React,{useMemo} from 'react'
import  { Component, useEffect, useState }  from 'react';
import {useTable, usePagination} from 'react-table'
import {COLUMNS} from './columns'
import './BasicTable.css'
export const BasicTable = (props) => {
    const jsonData = props.jsonData;
    console.log('data in BasicTable',JSON.stringify(jsonData));
    const columns = useMemo(()=>COLUMNS,[]);
    const data = useMemo(()=>jsonData,[]);

    const tableInstance = useTable({
        columns : columns,
        data : data
      
    },usePagination)
    const {getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        state,
        setPageSize,
        prepareRow} = tableInstance;
      const {pageIndex,pageSize} = state;
     
      const [first,setFirst] = useState(true);
      // set page size to 20.
      useEffect(()=>{
        if(first){
          setPageSize(20);
          setFirst(false);
        }
      })

      function onRowClicked(data){
        //console.log('clicked',data.recipe_title);
        console.log(data.recipe_id);
        localStorage.setItem('id',data.recipe_id);
        window.open('/recipe-voice-bot/recipe_info');
      }

      console.log('table props',getTableProps.pageSize);
    
      return (
        < div style={{ position: 'relative'}}>
          <div>
            <table   className = 'tablestyle' {...getTableProps() } >
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map(row => {
                  prepareRow(row)
                  return (
                    <tr  {...row.getRowProps()}>
                      <td onClick={ () => onRowClicked(row.original)} className='recipe_title_color' >{row.original.recipe_title}</td>
                      <td>{row.original.region}</td>
                      <td>{row.original.sub_region}</td>
                      <td>{row.original.servings}</td>


                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className='pagenation'>
            <span>
              Page{" "} {pageIndex + 1} of {pageOptions.length}
            </span>
            <button disabled = {!canPreviousPage}  className='buttonstyle1' onClick = {()=>previousPage()} >Previous</button>
            <button disabled = {!canNextPage} className='buttonstyle1' onClick ={()=>nextPage()} >Next</button>
          </div>
        </div>
      )
}