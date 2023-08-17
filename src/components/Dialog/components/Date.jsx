import React from 'react';
import styles from './Date.module.css';
import { format, isToday, parseISO } from 'date-fns';

const Date = (props) => {
  const date = parseISO(props.date);
  // Проверяем, сегодняшняя ли это дата
  const isTodayDate = isToday(date);

  // Форматируем дату в зависимости от того, сегодняшняя она или нет
  const formattedTime = isTodayDate
    ? 'Today'// Сегодня - часы и минуты
    : format(date, 'd MMMM');


  return (
    <div className={styles.main}>
        <div className={styles.main__date}>
            {formattedTime}
        </div>
    </div>
  )
}

export default Date