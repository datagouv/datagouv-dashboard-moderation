import os
import uuid
import click
import dataset

db = dataset.connect(os.getenv('DATABASE_URL', 'sqlite:///data.db'))
table = db["mod_db"]


@click.group()
def cli():
    pass


@cli.command()
def init_db():
    """Insert some dummy data in DB."""
    pass


if __name__ == "__main__":
    cli()
