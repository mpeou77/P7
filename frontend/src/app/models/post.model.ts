export class Post {
       _id!: string;
       userId!: string;
       lastname!: string;
       firstname!: string;
       feeling!: string;
       createDate!: any;
       imageUrl!: File;
       likes!: number;   
       usersLiked!: [string];   
}