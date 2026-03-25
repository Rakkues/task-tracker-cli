# Task Tracker CLI
Simple todo list tracker CLI program from [roadmap.sh](https://roadmap.sh/projects/task-tracker)

# How to Use
Clone the repository onto your PC and cd into the directory
```
git clone https://github.com/Rakkues/task-tracker-cli.git
cd task-tracker-cli
```

## Available Commands
### Adding Tasks
To add a new task:
```
node index.js add <task>
```

### Updating and deleting tasks
```
// Updating a task
node index.js update <task-index> <new task desc>

// Deleting a task
node index.js delete <task-index>

// Marking a task as in progress or done
node index.js mark-in-progress <task-index>
node index.js mark-done <task-index>

// Listing all tasks
node index.js list

// List by status
node index.js list <status> // (done, todo, in-progress)
```
