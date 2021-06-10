const supportedFileTypes = {
  'java': { ace: { mode: "java" } },
  'js': { ace: { mode: "javascript" } },
  'json': { ace: { mode: "javascript" } },
  'py': { ace: { mode: "python" } }
};

module.exports = {
  lookup(filename) {
    const file_ext = filename.substring(filename.lastIndexOf('.') + 1);
    const file_type = supportedFileTypes[file_ext];
    if (file_type) {
      return file_type;
    }
    return {
      ace: {
        mode: "text"
      }
    };
  }
};
