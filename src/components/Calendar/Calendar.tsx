import React, { memo, useState, useCallback, ChangeEvent } from 'react';
import { css } from '@emotion/css';

import { DAYS, colorBy } from '../../modules/calendar';
import { DailySales, dailyKey } from '../../model/DailySales';
import TotalCell from '../TotalCell';
import TableCell from './TableCell';

type Props = {
  dailySales2D: (DailySales | undefined)[][]
}

type Option = {
  value: keyof DailySales;
  label: string;
}

const options: Option[] = [{
  label: dailyKey.SALES,
  value: 'sales'
},{
  label: dailyKey.NUMBER_OF_ACCOUNTS,
  value: 'numberOfAccounts'
},{
  label: dailyKey.NUMBER_OF_CUSTOMERS,
  value: 'numberOfCustomers'
},{
  label: dailyKey.AVERAGE_AMOUNT,
  value: 'averageAmount'
},{
  label: dailyKey.NUMBER_OF_PRODUCTS,
  value: 'numberOfProducts'
},{
  label: dailyKey.TOTAL_NO_CASH_PAYMENT,
  value: 'totalNoCashPayment'
},{
  label: dailyKey.TOTAL_CASH_PAYMENT,
  value: 'totalCashPayment'
}];

const style = css`
  display:flex;
  
  p {
    margin: 0;
  }

  .title-text {
    font-size: 16px;
    padding: 4px;
  }

  .controller {
    flex-basis: 200px;
    padding: 18px 8px;
  }
  .calendar {
    flex: 1;
    height: 100vh;
    overflow-y: scroll;
  }

  .select {
    width: 100%;
    font-size: 18px;
    font-weight: bold;
    padding: 8px 10px;
  }
`;

const tableStyle = css`
  width: 100%;
  border-collapse:  collapse;

  th,td {
    padding: 8px 10px;
    border: solid 1px #ddd;

    &:nth-child(2n) {
      background: solid 1px #fcfcfc;
    }
  }

  tr {
    &:last-child {
      border-top: solid 2px #888;
    }
  }

  thead {
    border-bottom: solid 2px #888;
  }
`;

const Calendar: React.FC<Props> = memo(({ dailySales2D }) => {
  const initialDailySales = dailySales2D.flat().filter(item => item);
  const [dailySalesType, setDailySalesType] = useState<keyof DailySales>('sales');

  const totalByDay = DAYS.map((day, i) => {
    const salesByDay = initialDailySales.filter(item => item?.day === day).map(item => Number(item?.[dailySalesType]))
    return salesByDay
  })

  const handleSelect = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setDailySalesType(e.target.value as keyof DailySales)
  },[])
  
  return (
    <div className={style}>
      <div className='controller'>
        <p className='title-text'>表示項目</p>
        <select name="select" onChange={handleSelect} className='select'>
          {
            options.map((option, i) => <option key={`select-${i}`} value={option.value}>{ option.label }</option>)
          }
        </select>
      </div>
      <div className='calendar'>
        <table className={tableStyle}>
          <thead>
            <tr>
              {
                DAYS.map(day => <th key={`header-${day}`}>{ day }</th>)
              }
              <th>分析</th>
            </tr>
          </thead>
          <tbody>
            {
              dailySales2D.map((row, i) => {
                return <tr key={`row-${i}`}>{
                  row.map((col, j) => (
                    <td className='cell' style={{ background: colorBy(Number(col?.sales) || 0) }} key={`col-${j}`}>{
                      col && <TableCell dailySales={col} selectedDaily={dailySalesType} />
                    }
                    </td>
                  ))
                }
                  <td key={`col-final`}>
                    <TotalCell list={row.filter(item => item).map(item => Number(item?.sales || 0))} selectedDaily='sales' />
                  </td>
                </tr>
              })
            }
            {/* 曜日別合計 */}
            <tr>{
              DAYS.map(day => <td key={`total-${day}`}>{ day } 合計</td>)
            }</tr>
            <tr>
              {
                totalByDay.map((cols,i) => (
                  <td key={`total-day-${i}`}>
                    <TotalCell list={cols} selectedDaily={dailySalesType} />
                  </td>
                ))
              }
              <td>
                <TotalCell list={totalByDay.flat()} selectedDaily={dailySalesType} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
})

export default Calendar;