interface Task {
  id: number;
  name: string;
  completed: boolean;
}

class TodoAppMain {
  tasks: Task[] = [];
  taskList: HTMLUListElement;
  stats: HTMLParagraphElement;

  constructor() {
    this.taskList = document.getElementById('task-list') as HTMLUListElement;
    this.stats = document.getElementById('stats') as HTMLParagraphElement;

    this.loadTasks();
    this.renderTasks();

    const form = document.getElementById('task-form') as HTMLFormElement;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = document.getElementById('task-name') as HTMLInputElement;
      this.addTask(input.value);
      input.value = '';
    });

    const filterButtons = document.querySelectorAll('.filters button');
    filterButtons.forEach(btn => btn.addEventListener('click', () => {
      const filter = (btn as HTMLButtonElement).dataset.filter! as 'all' | 'completed' | 'pending';
      this.renderTasks(filter);
    }));
  }

  addTask(name: string) {
    const task: Task = { id: Date.now(), name, completed: false };
    this.tasks.push(task);
    this.saveTasks();
    this.renderTasks();
  }

  toggleTask(id: number) {
    this.tasks = this.tasks.map(task => task.id === id ? {...task, completed: !task.completed} : task);
    this.saveTasks();
    this.renderTasks();
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  loadTasks() {
    const data = localStorage.getItem('tasks');
    if (data) this.tasks = JSON.parse(data);
  }

  renderTasks(filter: 'all' | 'completed' | 'pending' = 'all') {
    this.taskList.innerHTML = '';
    const filtered = this.tasks.filter(task => {
      if (filter === 'all') return true;
      if (filter === 'completed') return task.completed;
      if (filter === 'pending') return !task.completed;
      return true;
    });

    filtered.forEach(task => {
      const li = document.createElement('li');
      li.textContent = task.name;
      li.className = task.completed ? 'completed' : '';
      li.addEventListener('click', () => this.toggleTask(task.id));
      this.taskList.appendChild(li);
    });

    const completedCount = this.tasks.filter(t => t.completed).length;
    this.stats.textContent = `Dokončené: ${completedCount} / ${this.tasks.length}`;
  }
}

// Initialize the TodoApp only once
new TodoAppMain();
