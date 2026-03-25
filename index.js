import * as fs from "fs/promises";
import { format } from "date-fns";

class Task {
  id;
  description;
  status;
  createdAt;
  updatedAt;

  constructor(id, description) {
    this.id = id;
    this.description = description;
    this.status = "in-progress";
    this.createdAt = format(new Date(), "yyyy-MM-dd");
    this.updatedAt = format(new Date(), "yyyy-MM-dd");
  }
}

// Main program logic
let command = process.argv[2];

switch (command) {
  case "add":
    const taskDesc = process.argv[3];
    addTask(taskDesc);
    break;
  case "list":
    let statusArg = process.argv[3];
    listTasks(statusArg);
    break;
}

// Functions
async function addTask(taskDesc) {
  let tasks = [];

  try {
    const data = await fs.readFile("tasks.json", "utf-8");
    tasks = data ? JSON.parse(data) : [];
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Error reading file:", error);
      return;
    }
  }

  const newTask = new Task(tasks.length + 1, taskDesc);
  tasks.push(newTask);

  try {
    await fs.writeFile("tasks.json", JSON.stringify(tasks, null, 2));
    console.log(`Task added successfully (ID: ${newTask.id}}`);
  } catch (error) {
    console.error("Error writing file: ", error);
  }
}

async function listTasks(status) {
  let tasks = [];
  console.log(status);

  try {
    const data = await fs.readFile("tasks.json", "utf-8");
    tasks = data ? JSON.parse(data) : [];
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Error reading file:", error);
      return;
    }
  }

  if (!status) {
    console.table(tasks);
  } else {
    let filteredTasks = tasks.filter((tasks) => {
      return tasks.status === status;
    });

    console.table(filteredTasks);
  }
}
