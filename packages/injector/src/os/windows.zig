const std = @import("std");
const utils = @import("utils");
const Logger = utils.Logger;
const string = utils.string;
const stringM = utils.stringM;
const global = @import("../global.zig");
const discord_platform = utils.discord_platform;
const join_path = utils.join_path;
const allocator = utils.allocator;

// TODO: rename to does_file_or_dir_exist
pub fn does_file_exist(path: string) bool {
    const file = std.fs.cwd().openFile(path, .{}) catch |e| switch (e) {
        error.IsDir => return true,
        else => {
            return false;
        },
    };

    defer file.close();
    return true;
}

pub fn get_hykord_default_source_folder() string {
    const home = std.process.getEnvVarOwned(allocator, "USERPROFILE") catch unreachable;

    return join_path(&.{home, ".hykord"});
}

pub fn get_app_directory(platform: discord_platform) string {
    const localAppData: string = std.process.getEnvVarOwned(allocator, "LOCALAPPDATA") catch unreachable;

    var searched: ?string = null;
    switch(platform) {
        .stable => searched = std.fmt.allocPrint(allocator, "{s}\\Discord", .{localAppData}) catch unreachable,
        .ptb => searched = std.fmt.allocPrint(allocator, "{s}\\DiscordPTB", .{localAppData}) catch unreachable,
        .canary => searched = std.fmt.allocPrint(allocator, "{s}\\DiscordCanary", .{localAppData}) catch unreachable,
        else => searched = std.fmt.allocPrint(allocator, "{s}\\DiscordDevelopment", .{localAppData}) catch unreachable,
    }

    while (searched == null or !does_file_exist(searched.?)) {
        Logger.err("Failed to locate discord {s} installation folder.", .{@tagName(platform)});
        Logger.infoNoBreak("Please, write your discord path: ", .{});
        searched = std.io.getStdIn().reader().readUntilDelimiterAlloc(allocator, '\n', 1024) catch unreachable;
    }

    const dir = std.fs.cwd().openDir(searched.?, .{ .iterate = true, }) catch unreachable;
    var iter = dir.iterate();
    var app_version_dir: stringM = "";

    while (iter.next() catch unreachable) |app_dir| {
        if (app_dir.kind != std.fs.File.Kind.Directory or std.mem.indexOf(u8, app_dir.name, "app") == null) continue;

        app_version_dir = allocator.dupeZ(u8, app_dir.name) catch unreachable;
    }

    return join_path(&.{searched.?, app_version_dir, "resources", "app"});
}