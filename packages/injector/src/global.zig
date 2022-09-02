const std = @import("std");
const utils = @import("utils");
const Logger = utils.Logger;
const string = utils.string;
const discord_platform = utils.discord_platform;
const allocator = utils.allocator;
const join_path = utils.join_path;
const handle_error = utils.handle_error;

pub const C = @import("c.zig");

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
        return handle_error(err, true);
    };

    const indexJsFile = std.fs.createFileAbsolute(join_path(&.{app_dir, "index.js"}), .{}) catch |err| {
        return handle_error(err, true);
    };
    defer indexJsFile.close();

    _ = indexJsFile.writeAll(std.fmt.allocPrint(allocator, "require(\"{s}\")", .{main_script}) catch unreachable) catch |err| {
        return handle_error(err, true);
    };

    const packageJsonFile = std.fs.createFileAbsolute(join_path(&.{app_dir, "package.json"}), .{}) catch |err| {
        return handle_error(err, true);
    };
    defer packageJsonFile.close();

    _ = packageJsonFile.writeAll("{\"name\": \"discord\", \"main\": \"index.js\"}") catch |err| {
        return handle_error(err, true);
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
        return handle_error(err, false);
    };
    _ = std.fs.deleteFileAbsolute(join_path(&.{app_dir, "package.json"})) catch |err| {
        return handle_error(err, false);
    };
    std.fs.deleteDirAbsolute(app_dir) catch |err| {
        return handle_error(err, false);
    };

    Logger.info("Successfully uninjected Hykord from {s}.", .{platform_});

    return;
}