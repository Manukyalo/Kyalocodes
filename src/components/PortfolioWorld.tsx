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
        player!: Phaser.Physics.Arcade.Sprite;
        cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
        wasd!: any;
        stations!: Array<{ key: string, x: number, y: number, color: number, label: string }>;

        preload() {
          this.load.image("tiles", "/assets/tileset.png");
          this.load.spritesheet("player", "/assets/character.png", {
            frameWidth: 32,
            frameHeight: 32,
          });
        }

        create() {
          this.add.rectangle(320, 240, 640, 480, 0x2d3b2e);

          this.stations = [
            { key: "about", x: 100, y: 100, color: 0xe8a33d, label: "Camp Tent" },
            { key: "projects", x: 540, y: 100, color: 0x4af0a0, label: "Radio Tower" },
            { key: "skills", x: 100, y: 380, color: 0x6fcf9e, label: "Workshop" },
            { key: "contact", x: 540, y: 380, color: 0xe8756b, label: "Totem" },
          ];

          this.stations.forEach((s) => {
            const zone = this.add.rectangle(s.x, s.y, 48, 48, s.color);
            this.physics.add.existing(zone, true);
            (zone as any).stationKey = s.key;
            this.add.text(s.x - 30, s.y - 40, s.label, { color: '#ffffff', fontSize: '12px' });
          });

          this.player = this.physics.add.sprite(320, 240, "player");
          this.player.setCollideWorldBounds(true);

          this.anims.create({
            key: "walk-down",
            frames: this.anims.generateFrameNumbers("player", { start: 0, end: 2 }),
            frameRate: 8,
            repeat: -1,
          });
          this.anims.create({
            key: "walk-up",
            frames: this.anims.generateFrameNumbers("player", { start: 3, end: 5 }),
            frameRate: 8,
            repeat: -1,
          });
          this.anims.create({
            key: "walk-left",
            frames: this.anims.generateFrameNumbers("player", { start: 6, end: 8 }),
            frameRate: 8,
            repeat: -1,
          });
          this.anims.create({
            key: "walk-right",
            frames: this.anims.generateFrameNumbers("player", { start: 9, end: 11 }),
            frameRate: 8,
            repeat: -1,
          });

          this.cursors = this.input.keyboard!.createCursorKeys();
          this.wasd = this.input.keyboard!.addKeys("W,A,S,D");
        }

        update() {
          const speed = 160;
          this.player.setVelocity(0);
          let moving = false;

          const isLeft = this.cursors.left.isDown || this.wasd.A.isDown || controlsRef.current.left;
          const isRight = this.cursors.right.isDown || this.wasd.D.isDown || controlsRef.current.right;
          const isUp = this.cursors.up.isDown || this.wasd.W.isDown || controlsRef.current.up;
          const isDown = this.cursors.down.isDown || this.wasd.S.isDown || controlsRef.current.down;

          if (isLeft) {
            this.player.setVelocityX(-speed);
            this.player.anims.play("walk-left", true);
            moving = true;
          } else if (isRight) {
            this.player.setVelocityX(speed);
            this.player.anims.play("walk-right", true);
            moving = true;
          } else if (isUp) {
            this.player.setVelocityY(-speed);
            this.player.anims.play("walk-up", true);
            moving = true;
          } else if (isDown) {
            this.player.setVelocityY(speed);
            this.player.anims.play("walk-down", true);
            moving = true;
          }

          if (!moving) {
            this.player.anims.stop();
          }

          this.stations.forEach((s) => {
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, s.x, s.y);
            if (dist < 40) {
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
