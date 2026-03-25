import * as fs from "fs/promises";
import { format } from "date-fns";
import { write } from "fs";

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
  case "delete":
    deleteTask(process.argv[3]);
}

// Functions
async function readJsonFile() {
  let tasks = [];

  try {
    const data = await fs.readFile("tasks.json", "utf-8");
    tasks = data ? JSON.parse(data) : [];
    return tasks;
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Error reading file:", error);
      return;
    }
  }
}

async function writeJsonFile(tasks, msg) {
  try {
    await fs.writeFile("tasks.json", JSON.stringify(tasks, null, 2));
    console.log(msg);
  } catch (error) {
    console.error("Error writing file: ", error);
  }
}

async function addTask(taskDesc) {
  let tasks = await readJsonFile();

  const newTask = new Task(Date.now(), taskDesc);
  tasks.push(newTask);

  writeJsonFile(tasks, `Task added successfully (ID: ${newTask.id}}`);
}

async function listTasks(status) {
  let tasks = await readJsonFile();

  if (!status) {
    console.table(tasks);
  } else {
    let filteredTasks = tasks.filter((tasks) => {
      return tasks.status === status;
    });

    console.table(filteredTasks);
  }
}

async function deleteTask(index) {
  let tasks = await readJsonFile();

  let newTasks = tasks.filter((task) => {
    return task !== tasks[index];
  });

  writeJsonFile(newTasks, `Successfully deleted task at index ${index}`);
}

async function markTask(index, status) {
  let tasks = readJsonFile();

  if (status === "done" || status === "in-progress") {
    tasks[index].status = status;
  }
}
