import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../../generated/prisma';
import { verifyToken } from '../../../../lib/auth';

const prisma = new PrismaClient();


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Verify token
  const { isValid, error } = verifyToken(request);
  if (!isValid) {
    return NextResponse.json(
      { error: error || 'Unauthorized' },
      { status: 401 }
    );
  }

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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Verify token
  const { isValid, error } = verifyToken(request);
  if (!isValid) {
    return NextResponse.json(
      { error: error || 'Unauthorized' },
      { status: 401 }
    );
  }

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Verify token
  const { isValid, error } = verifyToken(request);
  if (!isValid) {
    return NextResponse.json(
      { error: error || 'Unauthorized' },
      { status: 401 }
    );
  }

  // Check if user is MANAGER only MANAGER can delete movies
  const user = verifyToken(request).user;
  if (user?.role !== 'MANAGER') {
    return NextResponse.json(
      { error: 'Only MANAGER can delete movies' },
      { status: 403 }
    );
  }
  
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
