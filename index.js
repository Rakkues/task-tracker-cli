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
    this.createdAt = format(new Date(), "dd-MMM-yyyy h:mm:ss");
    this.updatedAt = format(new Date(), "dd-MMM-yyyy h:mm:ss");
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
  case "update":
    let newDesc = process.argv[4];
    updateTask(process.argv[3], newDesc);
    break;
  case "delete":
    deleteTask(process.argv[3]);
    break;
  case "mark-in-progress":
    markTask(process.argv[3], "in-progress");
    break;
  case "mark-done":
    markTask(process.argv[3], "done");
    break;
  default:
    console.log("Unknown command, aborting program");
    break;
}

// Functions
async function readJsonFile() {
  let tasks = [];

  try {
    const data = await fs.readFile("tasks.json", "utf-8");
    tasks = data ? JSON.parse(data) : [];
    return tasks;
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.writeFile("tasks.json", JSON.stringify(tasks, null, 2));
      console.log("Missing tasks.json file, creating new file");
      return tasks;
    }
    throw error;
  }
}

async function writeJsonFile(tasks, msg) {
  try {
    await fs.writeFile("tasks.json", JSON.stringify(tasks, null, 2));
    console.log(msg);
    console.table(tasks);
  } catch (error) {
    console.error("Error writing file: ", error);
  }
}

async function addTask(taskDesc) {
  let tasks = await readJsonFile();

  const newTask = new Task(Date.now(), taskDesc);
  tasks.push(newTask);

  await writeJsonFile(tasks, `Task added successfully (ID: ${newTask.id}}`);
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

async function updateTask(index, desc) {
  let tasks = await readJsonFile();

  tasks[index].description = desc;
  tasks[index].updatedAt = format(new Date(), "dd-MMM-yyyy h:mm:ss");
  await writeJsonFile(tasks, `Updated description for task ${index}`);
}

async function deleteTask(index) {
  let tasks = await readJsonFile();

  let newTasks = tasks.filter((task) => {
    return task !== tasks[index];
  });

  await writeJsonFile(newTasks, `Successfully deleted task at index ${index}`);
}

async function markTask(index, status) {
  let tasks = await readJsonFile();

  try {
    if (status === "done" || status === "in-progress") {
      tasks[index].status = status;
      tasks[index].updatedAt = format(new Date(), "dd-MMM-yyyy h:mm:ss");
      writeJsonFile(tasks, `Updated task at index ${index} to ${status}`);
    }
  } catch (error) {
    console.error("Error updating task: ", error);
  }
}
