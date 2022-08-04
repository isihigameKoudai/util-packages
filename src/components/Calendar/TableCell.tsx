import React, { memo } from 'react';
import { Tooltip } from '@mui/material';
import { css } from '@emotion/css';

import { DailySales, dailyKey, unitObj } from '../../model/DailySales';
import { divideDate } from '../../../packages/date'

type Props = {
  dailySales: DailySales
  selectedDaily: keyof typeof unitObj
}

const style = css`
  p {
    margin: 0;
  }

  .date {
    font-size: 20px;
  }
`;

const tooltipStyle = css`
  font-size: 14px;
`;

const TableCell: React.FC<Props> = memo(({ dailySales, selectedDaily = 'sales' }) => {
  const { month, day } = divideDate(dailySales.aggregationPeriod)
  return (
    <Tooltip title={
      <div>
        {
          /* eslint-disable-next-line */
          Object.keys(dailyKey).map((key) => <p className={tooltipStyle} key={key}>{ dailyKey[key] }: { dailySales.toObj[dailyKey[key]]}</p>)
        }
      </div>
    }>
      <div className={style}>
        <p className='date'>{ month }/{ day }</p>
        <span>{ dailySales[selectedDaily] }</span>
        <span>{ dailySales.unitBy(selectedDaily)}</span>
      </div>
    </Tooltip>
  )
})

export default TableCell;