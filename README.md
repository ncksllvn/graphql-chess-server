# Chess GraphQL
A GraphQL server for powering a chess game. It is driven by representing a chess board using [Forsyth–Edwards Notation (FEN)](https://en.wikipedia.org/wiki/Forsyth–Edwards_Notation).

Here's an example of a chess board in the starting positions.

<details>
<summary>GraphQL query</summary>

```graphql
{
  chess {
    analysis {
      bestMove {
        from
        to
        flags
      }
    }
    fen
    gameOver
    inCheck
    inCheckmate
    inDraw
    inStalemate
    insufficientMaterial
    inThreefoldRepetition
    moves {
      color
      from
      to
      promotion
    }
    turn
  }
}
```

</details>

<details>
<summary>Response JSON</summary>

```json
{
  "data": {
    "chess": {
      "analysis": {
        "bestMove": {
          "from": "d2",
          "to": "d4",
          "flags": ""
        }
      },
      "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      "gameOver": false,
      "inCheck": false,
      "inCheckmate": false,
      "inDraw": false,
      "inStalemate": false,
      "insufficientMaterial": false,
      "inThreefoldRepetition": false,
      "moves": [
        {
          "color": "w",
          "from": "a2",
          "to": "a3",
          "promotion": null
        },
        {
          "color": "w",
          "from": "a2",
          "to": "a4",
          "promotion": null
        },
        {
          "color": "w",
          "from": "b2",
          "to": "b3",
          "promotion": null
        },
        {
          "color": "w",
          "from": "b2",
          "to": "b4",
          "promotion": null
        },
        {
          "color": "w",
          "from": "c2",
          "to": "c3",
          "promotion": null
        },
        {
          "color": "w",
          "from": "c2",
          "to": "c4",
          "promotion": null
        },
        {
          "color": "w",
          "from": "d2",
          "to": "d3",
          "promotion": null
        },
        {
          "color": "w",
          "from": "d2",
          "to": "d4",
          "promotion": null
        },
        {
          "color": "w",
          "from": "e2",
          "to": "e3",
          "promotion": null
        },
        {
          "color": "w",
          "from": "e2",
          "to": "e4",
          "promotion": null
        },
        {
          "color": "w",
          "from": "f2",
          "to": "f3",
          "promotion": null
        },
        {
          "color": "w",
          "from": "f2",
          "to": "f4",
          "promotion": null
        },
        {
          "color": "w",
          "from": "g2",
          "to": "g3",
          "promotion": null
        },
        {
          "color": "w",
          "from": "g2",
          "to": "g4",
          "promotion": null
        },
        {
          "color": "w",
          "from": "h2",
          "to": "h3",
          "promotion": null
        },
        {
          "color": "w",
          "from": "h2",
          "to": "h4",
          "promotion": null
        },
        {
          "color": "w",
          "from": "b1",
          "to": "a3",
          "promotion": null
        },
        {
          "color": "w",
          "from": "b1",
          "to": "c3",
          "promotion": null
        },
        {
          "color": "w",
          "from": "g1",
          "to": "f3",
          "promotion": null
        },
        {
          "color": "w",
          "from": "g1",
          "to": "h3",
          "promotion": null
        }
      ],
      "turn": "w"
    }
  }
}
```

</details>

## Getting started
```bash
# clones this repo
git clone https://github.com/ncksllvn/chess-graphql.git

# switch to new directory
cd chess-graphql/

# Make sure you're using the right version of Node (via Node Version Manager)
nvm use

# Set up your environment
cp sample.env .env

# start the site
npm start # -> localhost:4000
```

### Running tests
```bash
npm test
```

## Examples

### Make a move
Example below returns the resultant board after passing the board in starting position with a move from A2 to A3 applied.

<details>
<summary>GraphQL mutation</summary>

```graphql
mutation {
  move(input: {
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    move: {
      from: a2,
      to: a3
    }
  }) {
    analysis {
      bestMove {
        from
        to
      }
    }
    fen
    gameOver
    inCheck
    inCheckmate
    moves {
      from
      to
      promotion
    }
    turn
  }
}
```
</details>

<details>
<summary>Response JSON</summary>

```json
{
  "data": {
    "move": {
      "analysis": {
        "bestMove": {
          "from": "d7",
          "to": "d5"
        }
      },
      "fen": "rnbqkbnr/pppppppp/8/8/8/P7/1PPPPPPP/RNBQKBNR b KQkq - 0 1",
      "gameOver": false,
      "inCheck": false,
      "inCheckmate": false,
      "moves": [
        {
          "from": "b8",
          "to": "c6",
          "promotion": null
        },
        {
          "from": "b8",
          "to": "a6",
          "promotion": null
        },
        {
          "from": "g8",
          "to": "h6",
          "promotion": null
        },
        {
          "from": "g8",
          "to": "f6",
          "promotion": null
        },
        {
          "from": "a7",
          "to": "a6",
          "promotion": null
        },
        {
          "from": "a7",
          "to": "a5",
          "promotion": null
        },
        {
          "from": "b7",
          "to": "b6",
          "promotion": null
        },
        {
          "from": "b7",
          "to": "b5",
          "promotion": null
        },
        {
          "from": "c7",
          "to": "c6",
          "promotion": null
        },
        {
          "from": "c7",
          "to": "c5",
          "promotion": null
        },
        {
          "from": "d7",
          "to": "d6",
          "promotion": null
        },
        {
          "from": "d7",
          "to": "d5",
          "promotion": null
        },
        {
          "from": "e7",
          "to": "e6",
          "promotion": null
        },
        {
          "from": "e7",
          "to": "e5",
          "promotion": null
        },
        {
          "from": "f7",
          "to": "f6",
          "promotion": null
        },
        {
          "from": "f7",
          "to": "f5",
          "promotion": null
        },
        {
          "from": "g7",
          "to": "g6",
          "promotion": null
        },
        {
          "from": "g7",
          "to": "g5",
          "promotion": null
        },
        {
          "from": "h7",
          "to": "h6",
          "promotion": null
        },
        {
          "from": "h7",
          "to": "h5",
          "promotion": null
        }
      ],
      "turn": "b"
    }
  }
}
```

### Lookup by FEN
Example below shows a board with a pawn positioned to be promoted in a move from C7 to C8.

<details>
<summary>GraphQL query</summary>

```graphql
{
  chess(fen: "8/q1P1k3/8/8/8/8/6PP/7K w - - 0 1") {
    analysis {
      bestMove {
        from
        to
      }
    }
    fen
    gameOver
    inCheck
    inCheckmate
    inDraw
    inStalemate
    insufficientMaterial
    inThreefoldRepetition
    moves {
      from
      to
      promotion
    }
    turn
  }
}
```

</details>

<details>
<summary>Response JSON</summary>

```json
{
  "data": {
    "chess": {
      "analysis": {
        "bestMove": {
          "from": "c7",
          "to": "c8"
        }
      },
      "fen": "8/q1P1k3/8/8/8/8/6PP/7K w - - 0 1",
      "gameOver": false,
      "inCheck": false,
      "inCheckmate": false,
      "inDraw": false,
      "inStalemate": false,
      "insufficientMaterial": false,
      "inThreefoldRepetition": false,
      "moves": [
        {
          "from": "c7",
          "to": "c8",
          "promotion": "q"
        },
        {
          "from": "c7",
          "to": "c8",
          "promotion": "r"
        },
        {
          "from": "c7",
          "to": "c8",
          "promotion": "b"
        },
        {
          "from": "c7",
          "to": "c8",
          "promotion": "n"
        },
        {
          "from": "g2",
          "to": "g3",
          "promotion": null
        },
        {
          "from": "g2",
          "to": "g4",
          "promotion": null
        },
        {
          "from": "h2",
          "to": "h3",
          "promotion": null
        },
        {
          "from": "h2",
          "to": "h4",
          "promotion": null
        }
      ],
      "turn": "w"
    }
  }
}
```

</details>
