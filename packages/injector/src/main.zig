const std = @import("std");
const c = @import("c.zig");
const global = @import("global.zig");
const utils = @import("utils");
const Logger = utils.Logger;
const string = utils.string;
const allocator = std.heap.page_allocator;

pub fn main() void {
    var args = std.process.argsAlloc(allocator) catch unreachable;
    args = args[1..];

    if (args.len == 0) {
        Logger.err("Please, specify what do you want, inject or uninject", .{});
        return;
    }

    if (args.len == 1) {
        Logger.err("Please, specify what your discord platform, stable, ptb, canary, development", .{});
        return;
    }

    var action: string = args[0];
    var platform: string = args[1];

    if (args.len == 2 and std.mem.eql(u8, std.mem.span(action), "inject")) {
        Logger.err("Please, specify absolute path of main script or use installer :P", .{});
        return;
    }

    if (std.mem.eql(u8, std.mem.span(action), "inject")) {
        var main_script: string = args[2];

        global.inject(platform, main_script);
    } else if (std.mem.eql(u8, std.mem.span(action), "uninject")) {
        global.uninject(platform);
    } else Logger.err("Invalid action has been provided.", .{});
}
