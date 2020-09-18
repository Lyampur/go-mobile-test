new Vue({
  el: '#app',
  data: {
    filterTask: '',
    searchTask: '',
    selectedOption: '',
    newTask: {id: '', name: '', date: '', isEditable: false},
    tasks: [
      {id: 1, name: 'Имя', date: '01/01/1900', isEditable: false},
      {id: 2, name: 'Вася', date: '02/02/2000', isEditable: false},
      {id: 3, name: 'Петя', date: '03/03/2010', isEditable: false},
      {id: 4, name: 'Стёпа', date: '18/09/2020', isEditable: false},
    ]
  },
  methods: {
    addTask() {
      let newTask = this.newTask;
      let date = this.newTask.date;

      this.newTask.id = parseInt(newTask.id, 10);

      // создаем дату
      this.newTask.date = this.createDate(date);

      this.tasks.push(newTask);

      this.newTask = {id: '', name: '', date: '', isEditable: false};
    },

    deleteTask(task) {
      // удаляем задачу из массива путем поиска индекса этой задачи
      return this.tasks.splice(this.tasks.indexOf(task, 0), 1);
    },

    editTask(task) {
      task.isEditable = !task.isEditable;
    },

    editBtnText(task) {
      return task.isEditable ? 'Сохранить' : 'Изменить';
    },

    // проводим поиск при помощи выбора имени столбца и вводимых пользователем данных
    // в каждом случае ищем до первого соответствия
    searchTaskByString() {
      let searchResult;
      switch (this.selectedOption) {
        // строгая проверка на соответсвие, вводимый id должен полностью совпадать с табличным
        case 'id':
          searchResult = this.tasks.find((task) => task.id == this.searchTask);
          searchResult ? this.colorFindedElement(searchResult) : alert(`По тегу id значения ${this.searchTask} ничего не найдено`);
          break;

        // поиск осуществляет путем частичного соответствия,
        // таким образом, если строка содержит искомую строку, поиск будет удачным
        case 'name':
          searchResult = this.tasks.find((task) => task.name.toLowerCase().includes(this.searchTask.toLowerCase()));
          searchResult ? this.colorFindedElement(searchResult) : alert(`По тегу name значения ${this.searchTask} ничего не найдено`);
          break;

        // также поиск осуществляется путем частичного соответствия
        case 'date':
          searchResult = this.tasks.find((task) => task.date.includes(this.searchTask));
          searchResult ? this.colorFindedElement(searchResult) : alert(`По тегу date значения ${this.searchTask} ничего не найдено`);
          break;

        default:
          alert('Неверные значения поиска');
      }
      alert(`Найдена задача с id: ${searchResult.id}, именем: ${searchResult.name} и датой: ${searchResult.date}`);
    },

    // выделение найденной задачи цветом
    // P.S. после добавления новых задач и их поиска, некорректно зарисовывает элементы
    // возможно это связано с взаимодействием Vue с DOM
    colorFindedElement(value) {
      let trs = document.querySelectorAll('tbody tr');
      trs.forEach((tr) => {
        if (tr.firstElementChild.firstElementChild._value == value.id || // условие для id
            tr.firstElementChild.nextElementSibling.firstElementChild._value == value.name || //условие для имени
            tr.lastElementChild.previousElementSibling.firstElementChild._value == value.date //условие для даты
            ) {
          tr.style.backgroundColor = '#faf6c5';
        }
        setTimeout(() => tr.style.backgroundColor = '', 5000);
      });
    },

    // проверка даты проходит только при добавлении новой задачи
    // при её изменении можно написать все что угодно
    createDate(dateString) {
      let template = 'DD/MM/YYYY';
      let date;

      // проверка, если строка пустая или не соответствует формату
      // добавляем текущую дату
      if (!dateString || ! /^\d{1,2}\/\d{1,2}\/\d{1,4}$/.test(dateString)) {
        date = new Date();
      } else {
        let dateParts = dateString.split('/');
        date = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
      }

      let day = date.getDate();
      if (day < 10) day = '0' + day;

      let month = date.getMonth() + 1;
      if (month < 10) month = '0' + month;

      let year = date.getFullYear();

      let output = template
        .replace('DD', day)
        .replace('MM', month)
        .replace('YYYY', year)

      return output;
    },
  },

  computed: {
    // фильтрация таблицы на основе введенной строки
    // соответсвие проверяется на всех столбцах,
    // поэтому найденное множество шире
    filteredTasksByString() {
      return this.tasks.filter((task) =>
          task.id.toString().includes(this.filterTask) ||
          task.name.toLowerCase().includes(this.filterTask.toLowerCase()) ||
          task.date.includes(this.filterTask)
        );
    },
  },
});
