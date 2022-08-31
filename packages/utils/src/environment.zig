pub const isMac = @import("builtin").target.os.tag == .macos;
pub const isWindows = @import("builtin").target.os.tag == .windows;
pub const isLinux = @import("builtin").target.os.tag == .linux;