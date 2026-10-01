export class Todo {
  constructor(title, description = "", dueDate = new Date() , priority = "medium", note = "", checklist = null, done = false) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.note = note;
    this.checklist = checklist;
    this.done = done;
  }

  isDone() {
    if(this.checklist === null) {
      return this.done;
    }
    return this.checklist.every((item) => item.done);
  }
}
