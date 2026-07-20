"use client";
import { useEffect, useRef } from "react";

export default function PortfolioWorld() {
  const gameRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef({ up: false, down: false, left: false, right: false });

  useEffect(() => {
    let game: any;
    (async () => {
      const Phaser = (await import("phaser")).default;

      class MainScene extends Phaser.Scene {
        player!: Phaser.Physics.Arcade.Image;
        cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
        wasd!: any;
        stations!: Array<{ key: string, x: number, y: number, label: string }>;

        preload() {
          // Load vector SVG assets
          this.load.svg("player", "/assets/character.svg");
          this.load.svg("about", "/assets/tent.svg");
          this.load.svg("contact", "/assets/tower.svg");
          this.load.svg("skills", "/assets/workshop.svg");
          this.load.svg("projects", "/assets/totem.svg");
        }

        create() {
          this.add.rectangle(320, 240, 640, 480, 0x2d3b2e);

          this.stations = [
            { key: "about", x: 100, y: 100, label: "Camp Tent" },
            { key: "contact", x: 540, y: 100, label: "Radio Tower" },
            { key: "skills", x: 100, y: 380, label: "Workshop" },
            { key: "projects", x: 540, y: 380, label: "Totem" },
          ];

          this.stations.forEach((s) => {
            // Render the SVG image instead of a colored rectangle
            const zone = this.add.image(s.x, s.y, s.key).setScale(0.8);
            this.physics.add.existing(zone, true);
            (zone as any).stationKey = s.key;
            this.add.text(s.x - 30, s.y - 45, s.label, { color: '#ffffff', fontSize: '12px', fontStyle: 'bold' }).setShadow(1, 1, '#000000', 2);
          });

          this.player = this.physics.add.image(320, 240, "player").setScale(1.2);
          this.player.setCollideWorldBounds(true);

          this.cursors = this.input.keyboard!.createCursorKeys();
          this.wasd = this.input.keyboard!.addKeys("W,A,S,D");
        }

        update() {
          const speed = 160;
          this.player.setVelocity(0);

          const isLeft = this.cursors.left.isDown || this.wasd.A.isDown || controlsRef.current.left;
          const isRight = this.cursors.right.isDown || this.wasd.D.isDown || controlsRef.current.right;
          const isUp = this.cursors.up.isDown || this.wasd.W.isDown || controlsRef.current.up;
          const isDown = this.cursors.down.isDown || this.wasd.S.isDown || controlsRef.current.down;

          if (isLeft) {
            this.player.setVelocityX(-speed);
            // Optionally flip the player horizontally when moving left
            this.player.setFlipX(true);
          } else if (isRight) {
            this.player.setVelocityX(speed);
            this.player.setFlipX(false);
          } 
          
          if (isUp) {
            this.player.setVelocityY(-speed);
          } else if (isDown) {
            this.player.setVelocityY(speed);
          }

          this.stations.forEach((s) => {
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, s.x, s.y);
            if (dist < 45) {
              window.dispatchEvent(new CustomEvent("station-enter", { detail: s.key }));
            }
          });
        }
      }

      const config = {
        type: Phaser.AUTO,
        width: 640,
        height: 480,
        parent: gameRef.current,
        physics: { default: "arcade", arcade: { debug: false } },
        scene: MainScene,
      };

      game = new Phaser.Game(config);
    })();

    return () => {
      if (game) game.destroy(true);
    };
  }, []);

  const handlePointerDown = (dir: keyof typeof controlsRef.current) => {
    controlsRef.current[dir] = true;
  };
  const handlePointerUp = (dir: keyof typeof controlsRef.current) => {
    controlsRef.current[dir] = false;
  };

  return (
    <div className="relative inline-block">
      <div ref={gameRef} className="rounded overflow-hidden border border-gray-700 shadow-xl" />
      
      {/* Mobile D-Pad */}
      <div className="absolute bottom-4 left-4 grid grid-cols-3 gap-2 sm:hidden select-none">
        <div />
        <button
          className="w-12 h-12 bg-white/20 rounded-full active:bg-white/50 backdrop-blur"
          onPointerDown={() => handlePointerDown("up")}
          onPointerUp={() => handlePointerUp("up")}
          onPointerLeave={() => handlePointerUp("up")}
        >
          ↑
        </button>
        <div />
        <button
          className="w-12 h-12 bg-white/20 rounded-full active:bg-white/50 backdrop-blur"
          onPointerDown={() => handlePointerDown("left")}
          onPointerUp={() => handlePointerUp("left")}
          onPointerLeave={() => handlePointerUp("left")}
        >
          ←
        </button>
        <button
          className="w-12 h-12 bg-white/20 rounded-full active:bg-white/50 backdrop-blur"
          onPointerDown={() => handlePointerDown("down")}
          onPointerUp={() => handlePointerUp("down")}
          onPointerLeave={() => handlePointerUp("down")}
        >
          ↓
        </button>
        <button
          className="w-12 h-12 bg-white/20 rounded-full active:bg-white/50 backdrop-blur"
          onPointerDown={() => handlePointerDown("right")}
          onPointerUp={() => handlePointerUp("right")}
          onPointerLeave={() => handlePointerUp("right")}
        >
          →
        </button>
      </div>
    </div>
  );
}
