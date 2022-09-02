const std = @import("std");
const utils = @import("utils");
const Logger = utils.Logger;
const string = utils.string;
const global = @import("../global.zig");
const discord_platform = global.discord_platform;
const join_path = global.join_path;
const allocator = std.heap.page_allocator;

pub fn get_app_directory(platform: discord_platform) string {
    const localAppData: string = std.os.getenv("LOCALAPPDATA") orelse "unknown";

    var searched: ?string = null;
    switch(platform) {
        .stable => searched = std.fmt.allocPrint(allocator, "{s}/Discord", .{localAppData}) catch unreachable,
        .ptb => searched = std.fmt.allocPrint(allocator, "{s}/DiscordPTB", .{localAppData}) catch unreachable,
        .canary => searched = std.fmt.allocPrint(allocator, "{s}/DiscordCanary", .{localAppData}) catch unreachable,
        else => searched = std.fmt.allocPrint(allocator, "{s}/DiscordDevelopment", .{localAppData}) catch unreachable,
    }

    while (searched == null or std.os.system.access(allocator.dupeZ(u8, searched.?) catch unreachable, std.os.F_OK) != 0) {
        Logger.err("Failed to locate discord {s} installation folder.", .{@tagName(platform)});
        Logger.infoNoBreak("Please, write your discord path: ", .{});
        searched = std.io.getStdIn().reader().readUntilDelimiterAlloc(allocator, '\n', 1024) catch unreachable;
    }

    const dir = std.fs.cwd().openDir(".", .{ .iterate = true, }) catch unreachable;
    var iter = dir.iterate();
    var app_version_dir = "";

    while (try iter.next()) |app_dir| {
        if (app_dir.kind != std.fs.File.Kind.Directory or std.mem.indexOf(u8, app_dir.name, "app") == null) continue;

        app_version_dir = app_dir.name;
    }

    return join_path(&.{searched, app_version_dir, "resources", "app"});
}