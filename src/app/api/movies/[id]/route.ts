import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../../generated/prisma';

const prisma = new PrismaClient();

// GET /api/movies/[id] - Fetch a specific movie
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid movie ID' },
        { status: 400 }
      );
    }

    const movie = await prisma.movie.findUnique({
      where: { id }
    });

    if (!movie) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(movie);
  } catch (error) {
    console.error('Error fetching movie:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movie' },
      { status: 500 }
    );
  }
}

// PUT /api/movies/[id] - Update a specific movie
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid movie ID' },
        { status: 400 }
      );
    }

    const { title, releaseDate, rating } = await request.json();

    // Validation
    if (!title || !releaseDate || !rating) {
      return NextResponse.json(
        { error: 'Title, release date, and rating are required' },
        { status: 400 }
      );
    }

    // Validate rating
    const validRatings = ['G', 'PG', 'M', 'MA', 'R'];
    if (!validRatings.includes(rating)) {
      return NextResponse.json(
        { error: 'Invalid rating. Must be one of: G, PG, M, MA, R' },
        { status: 400 }
      );
    }

    // Check if movie exists
    const existingMovie = await prisma.movie.findUnique({
      where: { id }
    });

    if (!existingMovie) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      );
    }

    // Update movie
    const updatedMovie = await prisma.movie.update({
      where: { id },
      data: {
        title,
        releaseDate: new Date(releaseDate),
        rating
      }
    });

    return NextResponse.json(updatedMovie);
  } catch (error) {
    console.error('Error updating movie:', error);
    return NextResponse.json(
      { error: 'Failed to update movie' },
      { status: 500 }
    );
  }
}

// DELETE /api/movies/[id] - Delete a specific movie
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid movie ID' },
        { status: 400 }
      );
    }

    // Check if movie exists
    const existingMovie = await prisma.movie.findUnique({
      where: { id }
    });

    if (!existingMovie) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      );
    }

    // Delete movie
    await prisma.movie.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Error deleting movie:', error);
    return NextResponse.json(
      { error: 'Failed to delete movie' },
      { status: 500 }
    );
  }
}
