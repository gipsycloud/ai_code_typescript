type LogFields = Record<string, unknown>;

function writeLog(level: "info" | "error", message: string, fields: LogFields = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...fields,
  };

  const output = JSON.stringify(entry);
  if (level === "error") {
    console.error(output);
  } else {
    console.log(output);
  }
}

export const logger = {
  info(message: string, fields?: LogFields) {
    writeLog("info", message, fields);
  },
  error(message: string, error?: unknown, fields: LogFields = {}) {
    const errorFields =
      error instanceof Error
        ? { error: error.message, stack: error.stack }
        : error === undefined
          ? {}
          : { error: String(error) };

    writeLog("error", message, { ...fields, ...errorFields });
  },
};
