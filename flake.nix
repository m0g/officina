{
  description = "Officina's website";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };

        buildInputs = with pkgs; [
          # Node.js
          nodejs_24
          yarn

          # Dependencies
          python3
          pkg-config
          vips
          glib

          # Development tools
          git
          fish
        ];

      in
      {
        devShells.default = pkgs.mkShell {
          inherit buildInputs;

          shellHook = ''
            exec fish -C '
              # Node modules binaries
              set -gx PATH "$PWD/node_modules/.bin" $PATH

              # Set NIX_SHELL indicator for prompt customization
              set -gx IN_NIX_SHELL 1

              # Custom prompt with magenta color to indicate Nix environment
              function fish_prompt
                set_color magenta
                echo -n "[nix] "
                set_color blue
                echo -n (prompt_pwd)
                set_color green
                echo -n (fish_git_prompt)
                set_color normal
                echo -n " > "
              end

              echo "Officina development environment loaded"
              echo "Node: "(node --version)
            '
          '';

          LANG = "en_US.UTF-8";
          LC_ALL = "en_US.UTF-8";

          # Use sharp's prebuilt libvips binary instead of building from
          # source against the Nix-provided global libvips.
          SHARP_IGNORE_GLOBAL_LIBVIPS = "1";
        };
      });
}
