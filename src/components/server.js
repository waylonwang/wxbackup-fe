/* eslint-disable no-unused-expressions */
import { prependWithCamelize } from "./util";

export const OutputType = {
  STDOUT: 0,
  ERROR: 1,
  STATUS: 2,
  SUCCESS: 3
};

export function sendOutput(obj, message, type) {
  let outputClass = "";
  switch (type) {
    case OutputType.ERROR:
      outputClass = "output-error";
      break;
    case OutputType.STATUS:
      outputClass = "output-status";
      break;
    case OutputType.SUCCESS:
      outputClass = "output-success";
      break;
    default:
      outputClass = "output-stdout";
  }
  if (obj.hasOwnProperty("outputs")) obj.outputs.push([message, outputClass]);
}
export function onTaskResponse(obj, args) {
  let [command, name, success, data, message] = args;
  let isNoMessage = message === null || message === undefined || message === "";
  try {
    obj[prependWithCamelize("onPreTaskResponse", command)](data);
  } catch (e) {
    if (e instanceof ReferenceError) {
      // do nothing
    } else if (e instanceof TypeError) {
      // do nothing
    } else {
      sendOutput(obj, e, OutputType.ERROR);
    }
  }
  isNoMessage
    ? null
    : sendOutput(obj, message, success ? OutputType.STDOUT : OutputType.ERROR);

  try {
    obj[prependWithCamelize("onPostTaskResponse", command)](data);
  } catch (e) {
    if (e instanceof ReferenceError) {
      // do nothing
    } else if (e instanceof TypeError) {
      // do nothing
    } else {
      sendOutput(obj, e, OutputType.ERROR);
    }
  }
}

export function onCommandResponse([obj, args]) {
  let [command, name, success, data, message] = args;
  let isNoName = name === null || name === undefined || name === "";
  let isNoMessage = message === null || message === undefined || message === "";
  try {
    obj[prependWithCamelize("onPreCommandResponse", command)](data);
  } catch (e) {
    if (e instanceof ReferenceError) {
      // do nothing
    } else if (e instanceof TypeError) {
      // do nothing
    } else {
      sendOutput(obj, e, OutputType.ERROR);
    }
  }

  isNoMessage
    ? null
    : sendOutput(obj, message, success ? OutputType.STDOUT : OutputType.ERROR);

  try {
    obj[prependWithCamelize("onPostCommandResponse", command)](data);
  } catch (e) {
    if (e instanceof ReferenceError) {
      // do nothing
    } else if (e instanceof TypeError) {
      // do nothing
    } else {
      sendOutput(obj, e, OutputType.ERROR);
    }
  }
  isNoName
    ? null
    : sendOutput(
        obj,
        decodeURI(name) + " → Command execution completed",
        OutputType.STATUS
      );
}

export const Channel = {
  methods: {
    joinServerChannel() {
      this.$debug("Server");
      let sid = this.$socket.id;
      if (sid !== undefined && sid !== null) {
        sid = sid.split("#");
        this.$socket.emit("join", {
          channel: this.channel,
          sid: sid[sid.length - 1]
        });
      }
    }
  }
};

export const Task = {
  methods: {
    addTask(args) {
      this.$debug("Server.Task.addtask", args);
      if (this.$store.state.serverConnected) {
        args.channel = this.channel;
        this.$socket.emit("add_task", args, this.addTaskAck);
      }
    },
    killTask(taskname) {
      this.$debug("Server.Task.killTask", taskname);
      if (this.$store.state.serverConnected) {
        this.$socket.emit("kill_task", {
          name: taskname,
          channel: this.channel
        });
      }
    },
    addTaskAck(command, name, success, data, message) {
      var isNoName = name === null || name === undefined || name === "";
      var isNoMessage =
        message === null || message === undefined || message === "";

      isNoMessage
        ? null
        : sendOutput(
            this,
            message,
            success ? OutputType.STDOUT : OutputType.ERROR
          );
      isNoName
        ? null
        : sendOutput(
            this,
            decodeURI(name) + " → Task execution completed",
            OutputType.STATUS
          );
    }
  }
};

export const Command = {
  methods: {
    execCommand(args) {
      if (this.$store.state.serverConnected) {
        args.channel = this.channel;
      }
      this.$debug("Server.Command.execCommand", args);
      this.$socket.emit("exec_command", args, this.execCommandAck);
    },
    execCommandAck(command, name, success, data, message) {
      onCommandResponse([this, [command, name, success, data, message]]);
    }
  }
};
