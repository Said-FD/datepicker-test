// Creating and handling Datepicker
const getMonthName = month => {
  const monthsInAYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return monthsInAYear[month]
}

const getDayName = day => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return daysOfWeek[day]
}

const getMonthYear = date => {
  const year = date.getFullYear()
  const month = getMonthName(date.getMonth())
  return `${month} ${year}`
}

const getDaysInMonth = date => {
  const year = date.getFullYear()
  const month = date.getMonth()
  const monthLastDay = new Date(year, month + 1, 0)
  return monthLastDay.getDate()
}

const getFirstDayOfMonth = date => {
  const firstDayOfMonth = new Date(date.setDate(1))
  return firstDayOfMonth.getDay()
}

const getDatesHTML = date => {
  const year = date.getFullYear()
  const month = date.getMonth()

  const now = new Date()
  const yearNow = now.getFullYear()
  const monthNow = now.getMonth()
  const dateNow = now.getDate()

  return Array.from({ length: getDaysInMonth(date) })
    .map((value, index) => {
      const day = index + 1
      const target = `${year}-${month + 1}-${day}`
      const targetDate = new Date(target)

      const firstDay = day === 1
        ? `--firstDayOfMonth: ${getFirstDayOfMonth(date) + 1}`
        : ''

      const isToday =
        year === yearNow &&
        month === monthNow &&
        day === dateNow

      const isBeforeToday =
        year < yearNow ||
        (year === yearNow && month < monthNow) ||
        (year === yearNow && month === monthNow && day < dateNow)

      const isWeekend = 
        targetDate.getDay() === 0 ||
        targetDate.getDay() === 6

      return `
        <button
          type="button"
          ${isToday ? 'data-today' : ''}
          ${firstDay ? `style="${firstDay}"` : ''}
          ${isBeforeToday || isWeekend ? 'disabled' : ''}
        >
          <time datetime="${target}">${day}</time>
        </button>
      `
    })
    .join('')
}

const getDatetimeAttr = date => {
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  return `${year}-${month + 1}-${day}`
}

const createDatepicker = date => {
  const today = new Date(date)
  const datepicker = document.createElement('div')
  datepicker.classList.add('datepicker')

  const buttonsHTML = `
    <div class="datepicker_month-buttons">
      <button type="button" class="datepicker_month-prev">
        <svg class="icon-chevron-left" width="24" height="24">
          <use xlink:href="#icon-chevron-left"></use>
        </svg>
      </button>
      <button type="button" class="datepicker_month-next">
        <svg class="icon-chevron-right" width="24" height="24">
          <use xlink:href="#icon-chevron-right"></use>
        </svg>
      </button>
    </div>
  `

  datepicker.innerHTML = `
    <div class="datepicker_month">
      <time datetime="${getDatetimeAttr(date)}">${getMonthYear(date)}</time>
      ${buttonsHTML}
    </div>
    <div class="datepicker_week">
      <p>Sun</p>
      <p>Mon</p>
      <p>Tue</p>
      <p>Wed</p>
      <p>Thu</p>
      <p>Fri</p>
      <p>Sat</p>
    </div>
    <div class="datepicker_dates">${getDatesHTML(date)}</div>
  `

  // Setting current date into timepicker by default
  const timepickerDate = document.querySelector('.timepicker_date')
  const todayMonth = getMonthName(today.getMonth())
  const todayDay = getDayName(today.getDay())
  const todayDate = today.getDate()

  timepickerDate.textContent = `${todayDay}, ${todayMonth} ${todayDate < 10 ? '0' + todayDate : todayDate}`

  // Handling months switch and date select
  const monthButtons = datepicker.querySelector('.datepicker_month-buttons')
  const dates = datepicker.querySelector('.datepicker_dates')

  monthButtons.addEventListener('click', event => {
    const button = event.target
    if (!button.matches('button')) return

    const timeElement = datepicker.querySelector('.datepicker_month').firstElementChild
    const dateTime = timeElement.getAttribute('datetime')
    const currentDate = new Date(dateTime)
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const day = currentDate.getDate()

    const targetMonth = button.matches('.datepicker_month-prev')
      ? new Date(year, month - 1, day)
      : new Date(year, month + 1, day)

    // Update the month and year in the calendar
    timeElement.textContent = getMonthYear(targetMonth)
    timeElement.setAttribute('datetime', getDatetimeAttr(targetMonth))

    // Change dates in the calendar
    dates.innerHTML = getDatesHTML(targetMonth)
  })

  dates.addEventListener('click', event => {
    const button = event.target
    if (!button.matches('button')) return

    const timeElement = button.firstElementChild
    const dateTime = timeElement.getAttribute('datetime')
    const dateTimeDate = new Date(dateTime)

    const month = getMonthName(dateTimeDate.getMonth())
    const day = getDayName(dateTimeDate.getDay())
    const selectedDate = dateTimeDate.getDate()

    // Update date in the timepicker
    timepickerDate.textContent = `${day}, ${month} ${selectedDate < 10 ? '0' + selectedDate : selectedDate}`

    // Highlight the selected date in the calendar
    const buttons = [...button.parentElement.children]
    buttons.forEach(btn => btn.classList.remove('is-selected'))
    button.classList.add('is-selected')
  })

  return datepicker
}

// Creating and adding the Datepicker into the DOM
const datepickerWrap = document.querySelector('.datepicker_wrapper')
const datepicker = createDatepicker(new Date())

datepickerWrap.appendChild(datepicker)
