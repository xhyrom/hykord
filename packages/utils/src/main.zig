const std = @import("std");

pub const Environment = @import("./environment.zig");
pub const Logger = @import("./logger.zig");
pub const string = []const u8;
pub const stringM = []u8;
pub const allocator = std.heap.page_allocator;
pub const discord_platform = enum { stable, ptb, canary, dev, development };

pub fn join_path(paths: []const []const u8) string {
    return std.fs.path.join(allocator, paths) catch unreachable;
}

pub fn handle_error(err: anytype, inject_client: bool) void {
    if (@TypeOf(err) == std.os.WriteError) {
        switch(err) {
            error.AccessDenied => {
                if (inject_client)
                    Logger.err("Hykord wasn't able to inject. Please re-run command with permissions.", .{})
                else
                    Logger.err("Hykord wasn't able to uninject. Please re-run command with permissions.", .{});

                return;
            },
            else => {
                if (inject_client)
                    Logger.err("Hykord wasn't able to inject. Error: {s}", .{ @errorName(err) })
                else
                    Logger.err("Hykord wasn't able to uninject. Error: {s}", .{ @errorName(err) });
                return;
            },
        }
    } else if(@TypeOf(err) == std.fs.File.OpenError or @TypeOf(err) == std.os.UnlinkError or @TypeOf(err) == std.fs.Dir.DeleteDirError) {
        switch(err) {
            error.AccessDenied => {
                if (inject_client)
                    Logger.err("Hykord wasn't able to inject. Please re-run command with permissions.", .{})
                else
                    Logger.err("Hykord wasn't able to uninject. Please re-run command with permissions.", .{});

                return;
            },
            error.FileNotFound => {
                Logger.err("It looks like you don't have injected discord client.", .{});
                return;
            },
            else => {
                if (inject_client)
                    Logger.err("Hykord wasn't able to inject. Error: {s}", .{ @errorName(err) })
                else
                    Logger.err("Hykord wasn't able to uninject. Error: {s}", .{ @errorName(err) });
                return;
            },
        }
    } else if(@TypeOf(err) == @typeInfo(@typeInfo(@TypeOf(std.fs.makeDirAbsolute)).Fn.return_type.?).ErrorUnion.error_set) {
        switch(err) {
            error.PathAlreadyExists => {
                // Ignore
            },
            else => {
                if (inject_client)
                    Logger.err("Hykord wasn't able to inject. Error: {s} {s}", .{ @errorName(err), @TypeOf(err) })
                else
                    Logger.err("Hykord wasn't able to uninject. Error: {s} {s}", .{ @errorName(err), @TypeOf(err) });
                return;
            }
        }
    }
}