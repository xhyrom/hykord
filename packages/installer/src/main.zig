const std = @import("std");
const c = @import("injector");
const Logger = @import("utils").Logger;

pub fn main() void {
    Logger.info("App Directory {s}", .{c.get_app_directory(.stable)});
    Logger.info("All your codebase are belong to us.", .{});
}
