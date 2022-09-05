const std = @import("std");

const pkgs = struct {
    const injector = std.build.Pkg{
        .name = "injector",
        .path = std.build.FileSource{ .path = "../injector/src/global.zig"},
        .dependencies = &.{utils}
    };
    const utils = std.build.Pkg{
        .name = "utils",
        .path = std.build.FileSource{ .path = "../utils/src/main.zig"}
    };
    const inquirer = std.build.Pkg{
        .name = "inquirer",
        .path = std.build.FileSource{ .path = "./dependencies/zig-inquirer/src/lib.zig" },
        .dependencies = &.{ansi, range}
    };

    // Only dependencies for inquirer
    const ansi = std.build.Pkg{
        .name = "ansi",
        .path = std.build.FileSource{ .path = "./dependencies/zig-ansi/src/lib.zig" },
    };
    const range = std.build.Pkg{
        .name = "range",
        .path = std.build.FileSource{ .path = "./dependencies/zig-range/src/lib.zig" },
    };
};

pub fn build(b: *std.build.Builder) void {
    // Standard target options allows the person running `zig build` to choose
    // what target to build for. Here we do not override the defaults, which
    // means any target is allowed, and the default is native. Other options
    // for restricting supported target set are available.
    const target = b.standardTargetOptions(.{});

    // Standard release options allow the person running `zig build` to select
    // between Debug, ReleaseSafe, ReleaseFast, and ReleaseSmall.
    const mode = b.standardReleaseOptions();

    const exe = b.addExecutable("installer", "src/main.zig");
    exe.setTarget(target);
    exe.setBuildMode(mode);
    exe.addPackage(pkgs.injector);
    exe.addPackage(pkgs.utils);
    exe.addPackage(pkgs.inquirer);
    exe.install();

    const run_cmd = exe.run();
    run_cmd.step.dependOn(b.getInstallStep());
    if (b.args) |args| {
        run_cmd.addArgs(args);
    }

    const run_step = b.step("run", "Run the app");
    run_step.dependOn(&run_cmd.step);

    const exe_tests = b.addTest("src/main.zig");
    exe_tests.setTarget(target);
    exe_tests.setBuildMode(mode);

    const test_step = b.step("test", "Run unit tests");
    test_step.dependOn(&exe_tests.step);
}
