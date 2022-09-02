const std = @import("std");
const utils = @import("utils");
const Logger = utils.Logger;
const string = utils.string;
const allocator = std.heap.page_allocator;

pub const C = @import("c.zig");
pub const discord_platform = enum { stable, ptb, canary, dev, development };

pub fn join_path(paths: []const []const u8) string {
    return std.fs.path.join(allocator, paths) catch unreachable;
}

fn handleErr(err: anytype, inject_client: bool) void {
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
    } else {
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
    }
}

pub fn inject(platform_: string, main_script: string) void {
    const platform = if (std.mem.eql(u8, platform_, "stable"))
        discord_platform.stable
    else if (std.mem.eql(u8, platform_, "ptb"))
        discord_platform.ptb
    else if (std.mem.eql(u8, platform_, "canary"))
        discord_platform.canary
    else 
        discord_platform.development;

    const app_dir = C.get_app_directory(platform);

    if (C.does_file_exist(app_dir)) {
        Logger.err("It looks like you already have injected discord client.", .{});
        return;
    }

    std.fs.makeDirAbsolute(app_dir) catch |err| {
        return handleErr(err, true);
    };

    const indexJsFile = std.fs.createFileAbsolute(join_path(&.{app_dir, "index.js"}), .{}) catch |err| {
        return handleErr(err, true);
    };
    defer indexJsFile.close();

    _ = indexJsFile.writeAll(std.fmt.allocPrint(allocator, "require(\"{s}\")", .{main_script}) catch unreachable) catch |err| {
        return handleErr(err, true);
    };

    const packageJsonFile = std.fs.createFileAbsolute(join_path(&.{app_dir, "package.json"}), .{}) catch |err| {
        return handleErr(err, true);
    };
    defer packageJsonFile.close();

    _ = packageJsonFile.writeAll("{\"name\": \"discord\", \"main\": \"index.js\"}") catch |err| {
        return handleErr(err, true);
    };

    Logger.info("Successfully injected Hykord into {s}.", .{platform_});

    return;
}

pub fn uninject(platform_: string) void {
    const platform = if (std.mem.eql(u8, platform_, "stable"))
        discord_platform.stable
    else if (std.mem.eql(u8, platform_, "ptb"))
        discord_platform.ptb
    else if (std.mem.eql(u8, platform_, "canary"))
        discord_platform.canary
    else 
        discord_platform.development;

    const app_dir = C.get_app_directory(platform);

    if (!C.does_file_exist(app_dir)) {
        Logger.err("It looks like you don't have injected discord client.", .{});
        return;
    }

    _ = std.fs.deleteFileAbsolute(join_path(&.{app_dir, "index.js"})) catch |err| {
        return handleErr(err, false);
    };
    _ = std.fs.deleteFileAbsolute(join_path(&.{app_dir, "package.json"})) catch |err| {
        return handleErr(err, false);
    };
    std.fs.deleteDirAbsolute(app_dir) catch |err| {
        return handleErr(err, false);
    };

    Logger.info("Successfully uninjected Hykord from {s}.", .{platform_});

    return;
}