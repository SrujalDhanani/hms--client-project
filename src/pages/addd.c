#include <stdio.h>

int main()
{
    int age;
    printf("Enter your age\n");

    scanf("%d" , &age);
    printf("yoy have entered %d as your age\n",age);
    if (age>18) {
        printf(you are eligible for vote);
    }

    else if(age<18) {
        printf("you are not eligible for vote");
    }
    return 0;
}