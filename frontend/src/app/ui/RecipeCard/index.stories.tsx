import { RecipeCard } from "./";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
    component: RecipeCard,
    args: {
        title: "タイトル",
        description: "写真に関する説明文".repeat(10),
        imageUrl: "/images/recipe-example.jpg",
    },
    decorators: [
        (Story) => (
            <div style={{ width: "320px" }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof RecipeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Wide: Story = {
    args: {},
};

export const Square: Story = {
    args: {
        ratio: "square",
    },
};

export const Portrait: Story = {
    args: {
        ratio: "portrait",
    },
};

export const ActionIcon: Story = {
    args: {
        actionIcon: {
            containerProps: {
                onClick: () => console.log("click"),
            },
            iconProps: {
                type: "star",
            },
        },
        showMeta: false,
    },
};

export const LineClamp2: Story = {
    args: {
        lineClamp: 2,
    },
};

export const LineClamp3: Story = {
    args: {
        lineClamp: 3,
    },
};

export const LineClamp4: Story = {
    args: {
        lineClamp: 4,
    },
};

export const NoRounded: Story = {
    args: {
        rounded: false,
    },
};