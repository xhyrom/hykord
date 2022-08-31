const PlatformSpecific = switch (@import("builtin").target.os.tag) {
    .macos => @import("./os/darwin.zig"),
    .linux => @import("./os/linux.zig"),
    .windows => @import("./os/windows.zig"),
    else => struct {},
};

pub usingnamespace PlatformSpecific;