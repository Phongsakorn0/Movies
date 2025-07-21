import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';

const prisma = new PrismaClient();

// GET /api/movies - Fetch all movies
export async function GET() {
  try {
    const movies = await prisma.movie.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 }
    );
  }
}

// POST /api/movies - Create a new movie
export async function POST(request: NextRequest) {
  try {
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

    // Create movie
    const movie = await prisma.movie.create({
      data: {
        title,
        releaseDate: new Date(releaseDate),
        rating
      }
    });

    return NextResponse.json(movie, { status: 201 });
  } catch (error) {
    console.error('Error creating movie:', error);
    return NextResponse.json(
      { error: 'Failed to create movie' },
      { status: 500 }
    );
  }
}
